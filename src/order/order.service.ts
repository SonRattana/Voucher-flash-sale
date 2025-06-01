import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Product } from '../product/entities/product.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AblyService } from '../websocket/ably.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly auditLogService: AuditLogService,
    @InjectQueue('order')
    private readonly orderQueue: Queue,
    private readonly ablyService: AblyService,
  ) {}

  async create(
    dto: CreateOrderDto,
    tenant: Tenant,
    userId: string,
  ): Promise<Order> {
    const product = await this.productRepo.findOne({
      where: { id: dto.product_id, tenant: { id: tenant.id } },
    });

    if (!product) {
      throw new NotFoundException('Product not found for this tenant');
    }

    const order = this.orderRepo.create({
      tenant,
      product,
      quantity: dto.quantity,
      order_number: dto.order_number,
      user_id: dto.user_id,
      total_amount: dto.total_amount,
      discount_amount: dto.discount_amount ?? 0,
      flash_sale_ids: dto.flash_sale_ids ?? [],
      status: dto.status ?? 'pending',
      voucher: dto.voucher_id ? ({ id: dto.voucher_id } as Voucher) : undefined,
    });

    const saved = await this.orderRepo.save(order);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'create',
      entityType: 'order',
      entityId: saved.id,
      newValue: saved,
    });
    await this.ablyService.publish(`tenant-${tenant.id}`, 'order.created', {
      orderId: saved.id,
      total: saved.total_amount,
    });
    await this.orderQueue.add('process-order', {
      tenantId: tenant.id,
      order_number: saved.order_number,
    });
    await this.ablyService.publish(`tenant-${tenant.id}`, 'order.created', {
      orderId: saved.id,
      total: saved.total_amount,
    });

    return saved;
  }

  async findAll(tenant: Tenant): Promise<Order[]> {
    return this.orderRepo.find({
      where: { tenant: { id: tenant.id } },
      relations: ['product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, tenant: Tenant): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id, tenant: { id: tenant.id } },
      relations: ['product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async remove(id: string, tenant: Tenant, userId: string): Promise<void> {
    const old = await this.findOne(id, tenant);
    await this.orderRepo.delete(id);
    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'delete',
      entityType: 'order',
      entityId: id,
      oldValue: old,
    });
  }
  async update(
    id: string,
    dto: UpdateOrderDto,
    tenant: Tenant,
    userId: string,
  ): Promise<Order> {
    const existing = await this.findOne(id, tenant);

    const updated = {
      ...existing,
      ...dto,
    };

    if (dto.product_id) {
      updated.product = { id: dto.product_id } as Product;
    }

    if (dto.voucher_id !== undefined) {
      updated.voucher = dto.voucher_id
        ? ({ id: dto.voucher_id } as Voucher)
        : undefined;
    }

    await this.orderRepo.save(updated);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'update',
      entityType: 'order',
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });

    return this.findOne(id, tenant);
  }
}

// src/product/product.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    dto: CreateProductDto,
    tenant: Tenant,
    userId: string,
  ): Promise<Product> {
    if (!tenant) {
      throw new Error('Tenant is required');
    }
    const currentCount = await this.productRepo.count({
      where: { tenant: { id: tenant.id } },
    });

    const packageInfo = tenant.package;
    if (packageInfo?.max_products && currentCount >= packageInfo.max_products) {
      throw new BadRequestException(
        `Package limit reached: Max ${packageInfo.max_products} products allowed.`,
      );
    }

    const product = this.productRepo.create({ ...dto, tenant });
    const saved = await this.productRepo.save(product);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'create',
      entityType: 'product',
      entityId: saved.id,
      newValue: saved,
    });

    return saved;
  }

  async findAll(tenant: Tenant): Promise<Product[]> {
    return this.productRepo.find({
      where: { tenant: { id: tenant.id } },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, tenant: Tenant): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, tenant: { id: tenant.id } },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    dto: Partial<CreateProductDto>,
    tenant: Tenant,
    userId: string,
  ): Promise<Product> {
    const old = await this.findOne(id, tenant);
    await this.productRepo.update(id, { ...dto, tenant });
    const updated = await this.findOne(id, tenant);
    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'update',
      entityType: 'product',
      entityId: id,
      oldValue: old,
      newValue: updated,
    });
    return updated;
  }

  async remove(id: string, tenant: Tenant, userId: string) {
    const old = await this.findOne(id, tenant);
    await this.productRepo.delete(id);
    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'delete',
      entityType: 'product',
      entityId: id,
      oldValue: old,
    });
  }
}

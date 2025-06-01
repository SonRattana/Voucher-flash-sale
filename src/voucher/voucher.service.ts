import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { Repository } from 'typeorm';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    dto: CreateVoucherDto,
    tenant: Tenant,
    userId: string,
  ): Promise<Voucher> {
    const voucher = this.voucherRepo.create({ ...dto, tenant });
    const saved = await this.voucherRepo.save(voucher);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId: userId,
      action: 'create',
      entityType: 'voucher',
      entityId: saved.id,
      newValue: saved,
    });
    return this.voucherRepo.save(voucher);
  }

  async findAll(tenant: Tenant): Promise<Voucher[]> {
    return this.voucherRepo.find({
      where: { tenant: { id: tenant.id } },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, tenant: Tenant): Promise<Voucher> {
    const voucher = await this.voucherRepo.findOne({
      where: { id, tenant: { id: tenant.id } },
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }
  async update(
    id: string,
    dto: Partial<CreateVoucherDto>,
    tenant: Tenant,
    userId: string,
  ): Promise<Voucher> {
    const old = await this.findOne(id, tenant);
    await this.voucherRepo.update(id, { ...dto, tenant });
    const updated = await this.findOne(id, tenant);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'update',
      entityType: 'voucher',
      entityId: id,
      oldValue: old,
      newValue: updated,
    });

    return updated;
  }

  async remove(id: string, tenant: Tenant, userId: string): Promise<void> {
    const old = await this.findOne(id, tenant);
    await this.voucherRepo.delete(id);

    await this.auditLogService.log({
      tenantId: tenant.id,
      userId,
      action: 'delete',
      entityType: 'voucher',
      entityId: id,
      oldValue: old,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(params: {
    tenantId: string;
    userId: string;
    action: 'create' | 'update' | 'delete';
    entityType: string;
    entityId: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
  }) {
    const log = this.auditRepo.create({
      tenant_id: params.tenantId,
      user_id: params.userId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      old_value: params.oldValue,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      new_value: params.newValue,
      ip_address: params.ipAddress,
    });
    return this.auditRepo.save(log);
  }
}

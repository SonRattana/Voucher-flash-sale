import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async findOneById(id: string): Promise<Tenant | undefined> {
    const tenant = await this.tenantRepo.findOne({
      where: { id, is_active: true },
    });
    return tenant === null ? undefined : tenant;
  }
}

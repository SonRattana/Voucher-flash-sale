import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantRepository } from './tenant.repository';
import { Tenant } from './entities/tenant.entity';
import { TenantUser } from './entities/tenant-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, TenantUser])],
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  exports: [TenantService, TenantRepository, TypeOrmModule],
})
export class TenantModule {}

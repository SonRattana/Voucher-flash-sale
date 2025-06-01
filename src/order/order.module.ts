// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { TenantModule } from '../tenant/tenant.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './order.processor';
import { JobLogModule } from 'src/common/job-log/job-log.module';
import { AblyModule } from 'src/websocket/ably.module';
@Module({
  imports: [
    AblyModule,
    TypeOrmModule.forFeature([Order, Product, Tenant]),
    TenantModule,
    AuditLogModule,
    JobLogModule,
    BullModule.registerQueue({
      name: 'order',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProcessor],
})
export class OrderModule {}

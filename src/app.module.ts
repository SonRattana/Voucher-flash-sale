import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/entities/tenant.entity';
import { TenantUser } from './tenant/entities/tenant-user.entity';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { VoucherModule } from './voucher/voucher.module';
import { Voucher } from './voucher/entities/voucher.entity';
import { Product } from './product/entities/product.entity';
import { FlashSaleItem } from './flash-sale/entities/flash-sale-item.entity';
import { FlashSaleCampaign } from './flash-sale/entities/campaign.entity';
import { FlashSaleModule } from './flash-sale/flash-sale.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { InventoryGateway } from './gateway/inventory.gateway';
import { WebsocketModule } from './websocket/websocket.module';
import { AppScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuditLog } from './audit-log/entities/audit-log.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobLog } from './common/job-log/entities/job-log.entity';
import { JobLogModule } from './common/job-log/job-log.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TenantThrottlerGuard } from './common/guards/tenant-throttler.guard';
import { WebhookModule } from './webhook/webhook.module';
import { TenantPackage } from './tenant/entities/tenant-package.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRootAsync({
      useFactory: (): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: 60,
            limit: 5,
          },
        ],
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'postgres',
      password: 'natv1211212212',
      database: 'voucher',
      entities: [
        Tenant,
        TenantUser,
        Voucher,
        Product,
        FlashSaleCampaign,
        FlashSaleItem,
        Order,
        Notification,
        AuditLog,
        JobLog,
        TenantPackage,
      ],
      synchronize: true,
      dropSchema: false,
      retryAttempts: 10,
      retryDelay: 3000,
    }),

    // Các module của dự án
    TenantModule,
    VoucherModule,
    ProductModule,
    FlashSaleModule,
    OrderModule,
    WebsocketModule,
    AppScheduleModule,
    NotificationModule,
    AuditLogModule,
    JobLogModule,
    AuthModule,
    WebhookModule,
  ],
  providers: [
    InventoryGateway,
    {
      provide: APP_GUARD,
      useClass: TenantThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'tenants', method: RequestMethod.POST },
        { path: 'tenants', method: RequestMethod.GET },
        { path: 'tenants/:id', method: RequestMethod.GET },
        { path: 'notifications/send', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashSaleController } from './flash-sale.controller';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleCampaign } from './entities/campaign.entity';
import { FlashSaleItem } from './entities/flash-sale-item.entity';
import { ProductModule } from '../product/product.module';
import { TenantModule } from '../tenant/tenant.module';
import { Product } from '../product/entities/product.entity';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([FlashSaleCampaign, FlashSaleItem, Product]),
    ProductModule,
    TenantModule,
    AuditLogModule,
  ],
  controllers: [FlashSaleController],
  providers: [FlashSaleService],
  exports: [FlashSaleService],
})
export class FlashSaleModule {}

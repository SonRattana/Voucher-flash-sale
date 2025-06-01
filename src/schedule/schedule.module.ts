import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FlashSaleTasks } from './tasks/flash-sale.tasks';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashSaleCampaign } from '../flash-sale/entities/campaign.entity';
import { FlashSaleItem } from '../flash-sale/entities/flash-sale-item.entity';
import { FlashSaleModule } from '../flash-sale/flash-sale.module';
import { VoucherTasks } from './tasks/voucher.tasks';
import { Voucher } from '../voucher/entities/voucher.entity';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([FlashSaleCampaign, FlashSaleItem, Voucher]),
    FlashSaleModule,
  ],
  providers: [FlashSaleTasks, VoucherTasks],
})
export class AppScheduleModule {}

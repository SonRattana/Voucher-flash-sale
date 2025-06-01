// src/schedule/tasks/voucher.tasks.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan } from 'typeorm';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VoucherTasks {
  private readonly logger = new Logger(VoucherTasks.name);

  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  @Cron('*/30 * * * * *') // ⏱ chạy mỗi 30 giây
  async updateVoucherStatus() {
    const now = new Date();

    // 1️⃣ Kích hoạt voucher đến thời gian bắt đầu
    const toActivate = await this.voucherRepo.find({
      where: {
        status: 'draft',
        start_date: LessThan(now),
      },
    });

    for (const voucher of toActivate) {
      voucher.status = 'active';
      await this.voucherRepo.save(voucher);
      this.logger.log(`🎯 Voucher activated: ${voucher.code}`);
    }

    // 2️⃣ Hết hạn voucher quá thời gian kết thúc
    const toExpire = await this.voucherRepo.find({
      where: {
        status: 'active',
        end_date: LessThan(now),
      },
    });

    for (const voucher of toExpire) {
      voucher.status = 'expired';
      await this.voucherRepo.save(voucher);
      this.logger.log(`💀 Voucher expired: ${voucher.code}`);
    }
  }
}

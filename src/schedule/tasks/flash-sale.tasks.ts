import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashSaleCampaign } from '../../flash-sale/entities/campaign.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class FlashSaleTasks {
  private readonly logger = new Logger(FlashSaleTasks.name);

  constructor(
    @InjectRepository(FlashSaleCampaign)
    private readonly campaignRepo: Repository<FlashSaleCampaign>,
  ) {}

  @Cron('*/10 * * * * *') // ⏰ chạy mỗi 10 giây
  async handleCampaignStatus() {
    const now = new Date();

    // 👉 Kích hoạt campaign nếu đủ điều kiện
    const scheduled = await this.campaignRepo.find({
      where: { status: 'scheduled', start_date: LessThanOrEqual(now) },
    });
    for (const campaign of scheduled) {
      campaign.status = 'active';
      await this.campaignRepo.save(campaign);
      this.logger.log(`🔥 Campaign activated: ${campaign.name}`);
    }

    // 👉 Kết thúc campaign nếu đã hết hạn
    const active = await this.campaignRepo.find({
      where: { status: 'active', end_date: LessThanOrEqual(now) },
    });
    for (const campaign of active) {
      campaign.status = 'ended';
      await this.campaignRepo.save(campaign);
      this.logger.log(`🧊 Campaign ended: ${campaign.name}`);
    }
  }
}

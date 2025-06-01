import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { RedisPubSubService } from '../websocket/services/redis-pubsub.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly redisPubSub: RedisPubSubService,
  ) {}

  async sendNotification(data: {
    tenantId: string;
    title: string;
    message: string;
    type: NotificationType;
    reference_id?: string;
  }) {
    const notification = this.notificationRepo.create({
      tenant_id: data.tenantId,
      title: data.title,
      message: data.message,
      type: data.type,
      reference_id: data.reference_id || null,
      status: 'sent',
      target_user_ids: [],
    });

    const saved = await this.notificationRepo.save(notification);

    const payload = {
      id: saved.id,
      tenantId: saved.tenant_id,
      title: saved.title,
      message: saved.message,
      type: saved.type,
      reference_id: saved.reference_id,
    };

    this.redisPubSub.publish('notification.sent', payload);
    return saved;
  }
}

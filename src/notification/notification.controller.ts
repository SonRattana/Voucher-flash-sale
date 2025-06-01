import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  send(@Body() dto: CreateNotificationDto) {
    return this.notificationService.sendNotification({
      tenantId: dto.tenantId,
      title: dto.title,
      message: dto.message,
      type: dto.type as any,
      reference_id: dto.reference_id,
    });
  }
}

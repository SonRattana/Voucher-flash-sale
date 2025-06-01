import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationController } from './notification.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Notification]), WebsocketModule],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}

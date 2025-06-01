import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { RedisPubSubService } from './services/redis-pubsub.service';
import { AblyService } from './ably.service';
@Module({
  providers: [WebsocketGateway, RedisPubSubService, AblyService],
  exports: [RedisPubSubService, AblyService],
})
export class WebsocketModule {}

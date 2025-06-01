import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { WebsocketGateway } from '../websocket.gateway';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private readonly gateway: WebsocketGateway) {
    this.publisher = new Redis();
    this.subscriber = new Redis();
  }

  onModuleInit() {
    this.subscriber.subscribe('order.created', (err, count) => {
      if (err) {
        console.error('❌ Redis subscribe error:', err);
      } else {
        console.log(`✅ Subscribed to ${count} channel(s)`);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (this.subscriber as any).on(
      'message',
      (channel: string, message: string) => {
        console.log(`📨 Redis [${channel}] ${message}`);
        const payload: Record<string, string> = {};
        message.split(';').forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key && value) {
            payload[key.trim()] = value.trim();
          }
        });

        if (payload.tenantId) {
          this.gateway.sendOrderUpdate(payload.tenantId, payload);
        } else {
          console.warn('⚠️ No tenantId found in message');
        }
      },
    );
  }

  publish(channel: string, payload: any) {
    const message = JSON.stringify(payload);
    return this.publisher.publish(channel, message);
  }

  onModuleDestroy() {
    this.publisher.quit();
    this.subscriber.quit();
  }
}

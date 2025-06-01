import { Injectable, Logger } from '@nestjs/common';
import * as Ably from 'ably';

@Injectable()
export class AblyService {
  private readonly logger = new Logger(AblyService.name);
  private readonly ably: Ably.Realtime;

  constructor() {
    const apiKey = process.env.ABLY_API_KEY;

    if (!apiKey) {
      throw new Error(
        '❌ ABLY_API_KEY is not defined in environment variables',
      );
    }

    this.ably = new Ably.Realtime(apiKey);
  }

  async publish(channel: string, event: string, data: any): Promise<void> {
    const ch = this.ably.channels.get(channel);
    try {
      await ch.publish(event, data);
      this.logger.log(
        `✅ Published to Ably channel [${channel}] event [${event}]`,
      );
    } catch (err: any) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : String(err);
      this.logger.error(`❌ Failed to publish to Ably: ${errorMessage}`);
    }
  }
}

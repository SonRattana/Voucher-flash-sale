import { Controller, Post, Body } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post('receive')
  handleWebhook(@Body() payload: any) {
    console.log('📩 Webhook received:', JSON.stringify(payload, null, 2));
    return { message: 'Webhook received!' };
  }
}

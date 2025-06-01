import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class InventoryGateway {
  @WebSocketServer()
  server: Server;

  notifyStockChange(productId: string, stock: number) {
    this.server.emit(`stock-update:${productId}`, { productId, stock });
  }

  notifyCampaignChange(campaignId: string, data: any) {
    this.server.emit(`campaign-update:${campaignId}`, data);
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'] },
  namespace: '/ws',
  transports: ['websocket'],
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('✅ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const tenantId = client.handshake.headers['x-tenant-id'];

    console.log('🧩 Headers:', client.handshake.headers);

    if (tenantId && typeof tenantId === 'string') {
      client.join(tenantId);
      console.log(`👤 Client joined room: ${tenantId}`);
    } else {
      console.log('❌ No tenantId in headers');
      client.disconnect(true);
    }
  }

  sendOrderUpdate(tenantId: string, payload: any) {
    console.log('📢 Emitting orderUpdate to', tenantId, payload);
    this.server.to(tenantId).emit('orderUpdate', payload);
  }
}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TransactionGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    // console.log('Client connected');
  }

  handleDisconnect(client: any) {
    // console.log('Client disconnected');
  }

  sendMessage(status: string) {
    this.server.emit('transaction', status);
  }
}
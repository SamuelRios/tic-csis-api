import { Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';

@WebSocketGateway()
export class DetectionGateway {
  @WebSocketServer()
  server;

  sendDetectionUpdate(detection: any) {
    console.log(detection)
    this.server.emit('detectionUpdate', detection);
  }

  // @SubscribeMessage('message')
  // handleMessage(@MessageBody() message: string): void {
  //   this.server.emit('message', message);
  // }
}

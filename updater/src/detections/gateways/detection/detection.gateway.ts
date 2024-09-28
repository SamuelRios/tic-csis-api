import { forwardRef, Inject, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
import { DetectionsService } from '../../services/detections.service';

@WebSocketGateway()
export class DetectionGateway {

  constructor(
    @Inject(forwardRef(() => DetectionsService))
    private readonly detectionService: DetectionsService
  ) {}


  @WebSocketServer()
  server;

  sendDetectionUpdate(detection: any) {
    console.log(detection)
    this.server.emit('detectionUpdate', detection);
  }

  async handleConnection(client: any) {
    const activeDetections = await this.detectionService.getAllActiveDetections(); // Chama o método do serviço
    client.emit("activeDetections", activeDetections); // Envia as detecções ativas para o cliente
  }
}

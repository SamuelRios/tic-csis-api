import { forwardRef, Inject, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
import { DetectionsService } from '../../services/detections.service';

@WebSocketGateway(3001, { transports: ['websocket'] })
export class DetectionGateway {

  constructor(
    @Inject(forwardRef(() => DetectionsService))
    private readonly detectionService: DetectionsService
  ) {}


  @WebSocketServer()
  server;

  sendDetectionCreated(detection: any) {
    this.server.emit('detectionCreated', detection);
  }

  private async handleConnection(client: any) {
    console.log("handle, conectado")
    const activeDetections = await this.detectionService.getAllActiveDetections(); // Chama o método do serviço
    client.emit("activeDetections", activeDetections); // Envia as detecções ativas para o cliente
  }

  sendDetectionClosed(detectionId: number) {
    console.log("vou enviar notificação: " + detectionId);
    this.server.emit('detectionClosed', detectionId);
  }
  
}

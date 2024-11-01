import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProcessorService } from 'src/services/processor/processor.service';

@WebSocketGateway(3000, { transports: ['websocket'] })
export class DetectionsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly processorService: ProcessorService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('new_detection')
  async handleDetection(@MessageBody() message: { detectionData: any; frame: Buffer }) {
    const { detectionData, frame } = message;
    await this.processorService.process(detectionData, frame);
  }

  @SubscribeMessage('new_detection_saved_image')
  async handleDetectionWith(@MessageBody() detectionData) {
    await this.processorService.processSavedImg(detectionData);
  }
}
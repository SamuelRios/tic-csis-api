import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateDetectionDto } from '../dto/create-detection.dto';
import { DetectionEntity } from '../entities/detection.entity';
import { CameraEntity } from '../entities/camera.entity';
import { CameraService } from './camera.service';
import { CameraLocationService } from './cameraLocation.service';
import { CameraLocationEntity } from '../entities/cameraLocation.entity';
import { PriorityEntity } from '../entities/priority.entity';
import { PriorityService } from './priority.service';
import { StatusService } from './status.service';
import { UserService } from './user.service';
import { StatusEntity } from '../entities/status.entity';
import { UserEntity } from '../entities/user.entity';
import { DetectionGateway } from '../gateways/detection/detection.gateway';

@Injectable()
export class DetectionsService {
  
  constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
    private readonly cameraService: CameraService,
    private readonly cameraLocationService: CameraLocationService,
    private readonly priorityService: PriorityService,
    private readonly statusService: StatusService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => DetectionGateway))
    private readonly detectionGateway: DetectionGateway
  ) {}

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find();
  }
  
  // Método para retornar todas as detecções ativas
  async getAllActiveDetections(): Promise<DetectionEntity[]> {
    return this.detectionsRepository.find({
      where: {
        status: {
          statusId: Not(2)
        }
      },
      relations: ['camera', 'location', 'user', 'priority', 'status']
    });
  }

  async getActiveDetectionByCameraNameAndCategory(cameraName: string, category: string): Promise<DetectionEntity | null> {
    return await this.detectionsRepository.findOne({
      where: {
        camera: {
          name: cameraName
        },
        category,
        status: {
          statusId: Not(2)
        },
      },
      relations: ["status"]
    });
  }

  async create(
    cDetectionDto: CreateDetectionDto,
    framePath: string
  ): Promise<DetectionEntity> {
    console.log(cDetectionDto.timestamp);
    const { camera, cameraLocation } = await this.getDetectionCameraAndLocation(
      cDetectionDto.cameraName, cDetectionDto.timestamp
    );
    console.log("depois do get")
    console.log(JSON.stringify(camera))
    console.log(JSON.stringify(cameraLocation))
    const detection = this.detectionsRepository.create();
    detection.camera = camera;
    detection.location = cameraLocation;
    detection.category = cDetectionDto.category;
    detection.framePath = framePath
    // detection.priority = await this.getPriority(cDetectionDto.priorityName);
    console.log("aqui antes do status")
    detection.status = await this.getStatus("Aberto");
    detection.user = await this.getUser("Operador 01");
    detection.timestamp = new Date(cDetectionDto.timestamp);
    const savedDetection = await this.detectionsRepository.save(detection);
    this.detectionGateway.sendDetectionUpdate(savedDetection);
    return savedDetection;
  }

  async closeDetection(detectionId: number): Promise<DetectionEntity | null> {
    const detection = await this.detectionsRepository.findOne({ where: { detectionId, status: {statusId: Not(2)} }, relations: ['camera'] });
    
    if (!detection) {
      return null;
    }

    detection.status = await this.getStatus("Fechado");
    return this.detectionsRepository.save(detection);
  }

  private async getStatus(statusName: string): Promise<StatusEntity> {
    let status: StatusEntity = await this.statusService.findByName(statusName);
    if(!status)
      status = await this.statusService.create({statusName: statusName});
    return status;
  }

  private async getUser(userName: string){
    let user: UserEntity = await this.userService.findByName(userName);
    if(!user)
      user = await this.userService.create({userName: userName});
    return user;
  }


  private async getDetectionCameraAndLocation(cameraName: string, timestamp: Date) {
    let camera: CameraEntity = await this.cameraService.findByName(cameraName);
    

    if (!camera) {
      camera = await this.cameraService.create({ name: cameraName, hasGps: true });
    }
    console.log("aqui")
    
    let cameraLocation: CameraLocationEntity;
    console.log(JSON.stringify(camera))
    cameraLocation = await this.cameraLocationService.findActiveByCameraId(camera.cameraId);
    console.log("ca dps do find")
    return { camera, cameraLocation };
  }

}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetectionDto } from '../dto/create-detection.dto';
import { DetectionEntity } from '../entities/detection.entity';
import { CameraEntity } from '../entities/camera.entity';
import { CameraService } from './camera.service';
import { CameraLocationService } from './cameraLocation.service';
import { CameraLocationEntity } from '../entities/cameraLocation.entity';
import { PriorityEntity } from '../entities/priority.entity';
import { PriorityService } from './priority.service';
import { StatusService } from './status.service';
import { OperatorService } from './operator.service';
import { StatusEntity } from '../entities/status.entity';
import { OperatorEntity } from '../entities/operator.entity';

@Injectable()
export class DetectionsService {
  constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
    private readonly cameraService: CameraService,
    private readonly cameraLocationService: CameraLocationService,
    private readonly priorityService: PriorityService,
    private readonly statusService: StatusService,
    private readonly operatorService: OperatorService,
  ) {}

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find();
  }

  async create(
    cDetectionDto: CreateDetectionDto,
    framePath: string
  ): Promise<DetectionEntity> {
    console.log(cDetectionDto.timestamp);
    const { camera, cameraLocation } = await this.getDetectionCameraAndLocation(
      cDetectionDto.cameraName,cDetectionDto.timestamp, cDetectionDto.latitude, cDetectionDto.longitude
    );
    console.log("depois do get")
    console.log(JSON.stringify(camera))
    console.log(JSON.stringify(cameraLocation))
    const detection = this.detectionsRepository.create();
    detection.camera = camera;
    detection.location = cameraLocation;
    detection.category = cDetectionDto.categoryNumber;
    detection.classNumber = cDetectionDto.classNumber;
    detection.className = cDetectionDto.className;
    detection.framePath = framePath
    detection.priority = await this.getPriority(cDetectionDto.priorityName);
    console.log("aqui antes do status")
    detection.status = await this.getDetectionStatus("Aberto");
    detection.operator = await this.getDetectionOperator("Operador 01");
    detection.timestamp = new Date(cDetectionDto.timestamp);
    return this.detectionsRepository.save(detection);
  }

  async getPriority(priorityName: string): Promise<PriorityEntity> {
    let priority: PriorityEntity = await this.priorityService.findByName(priorityName);
    if(!priority)
      priority = await this.priorityService.create({ priorityName: priorityName });
    return priority;
  }

  async getDetectionStatus(statusName: string): Promise<StatusEntity> {
    let status: StatusEntity = await this.statusService.findByName(statusName);
    if(!status)
      status = await this.statusService.create({statusName: statusName});
    return status;
  }

  async getDetectionOperator(operatorName: string){
    let operator: OperatorEntity = await this.operatorService.findByName(operatorName);
    if(!operator)
      operator = await this.operatorService.create({operatorName: operatorName});
    return operator;
  }


  async getDetectionCameraAndLocation(cameraName: string, timestamp: Date, latitude?: number, longitude?: number) {
    let camera: CameraEntity = await this.cameraService.findByName(cameraName);
    

    if (!camera) {
      camera = await this.cameraService.create({ name: cameraName, hasGps: true });
    }
    console.log("aqui")
    
    let cameraLocation: CameraLocationEntity;
    console.log(JSON.stringify(camera))
    cameraLocation = await this.cameraLocationService.findActiveByCameraId(camera.cameraId);
    
    if (cameraLocation) {
      console.log("cá")
      console.log(JSON.stringify(cameraLocation))
      if (cameraLocation.latitude != latitude || cameraLocation.longitude != longitude) {
        console.log("teste aqui")
        await this.cameraLocationService.update(cameraLocation.locationId, { isActive: false });
        console.log(timestamp)
        cameraLocation = await this.cameraLocationService.create({
          camera: camera,
          latitude: latitude,
          longitude: longitude,
          isActive: true,
          timestamp: timestamp
        });
      }
    } else {
      console.log("coá")
      if(latitude && longitude)
        cameraLocation = await this.cameraLocationService.create({
          camera: camera,
          latitude: latitude,
          longitude: longitude,
          isActive: true,
          timestamp: timestamp
        });
      
    }

    return { camera, cameraLocation };
  }

}

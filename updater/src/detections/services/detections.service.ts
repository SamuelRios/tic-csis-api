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
import { UserService } from './user.service';
import { StatusEntity } from '../entities/status.entity';
import { UserEntity } from '../entities/user.entity';

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
      cDetectionDto.cameraName, cDetectionDto.timestamp
    );
    console.log("depois do get")
    console.log(JSON.stringify(camera))
    console.log(JSON.stringify(cameraLocation))
    const detection = this.detectionsRepository.create();
    detection.camera = camera;
    detection.location = cameraLocation;
    detection.category = cDetectionDto.categoryNumber;
    detection.framePath = framePath
    // detection.priority = await this.getPriority(cDetectionDto.priorityName);
    console.log("aqui antes do status")
    detection.status = await this.getDetectionStatus("Aberto");
    detection.user = await this.getDetectionUser("Operador 01");
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

  async getDetectionUser(userName: string){
    let user: UserEntity = await this.userService.findByName(userName);
    if(!user)
      user = await this.userService.create({userName: userName});
    return user;
  }


  async getDetectionCameraAndLocation(cameraName: string, timestamp: Date) {
    let camera: CameraEntity = await this.cameraService.findByName(cameraName);
    

    if (!camera) {
      camera = await this.cameraService.create({ name: cameraName, hasGps: true });
    }
    console.log("aqui")
    
    let cameraLocation: CameraLocationEntity;
    console.log(JSON.stringify(camera))
    cameraLocation = await this.cameraLocationService.findActiveByCameraId(camera.cameraId);
    console.log("ca dps do find")
    // if (cameraLocation) {
    //   console.log("cá")
    //   console.log(JSON.stringify(cameraLocation))
    //   if (cameraLocation.latitude != latitude || cameraLocation.longitude != longitude) {
    //     console.log("teste aqui")
    //     await this.cameraLocationService.update(cameraLocation.locationId, { isActive: false });
    //     console.log(timestamp)
    //     cameraLocation = await this.cameraLocationService.create({
    //       camera: camera,
    //       latitude: latitude,
    //       longitude: longitude,
    //       isActive: true,
    //       timestamp: timestamp
    //     });
    //   }
    // } else {
    //   console.log("coá")
    //   if(latitude && longitude)
    //     cameraLocation = await this.cameraLocationService.create({
    //       camera: camera,
    //       latitude: latitude,
    //       longitude: longitude,
    //       isActive: true,
    //       timestamp: timestamp
    //     });
      
    // }

    return { camera, cameraLocation };
  }

}

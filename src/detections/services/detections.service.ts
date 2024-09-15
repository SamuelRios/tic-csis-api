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

@Injectable()
export class DetectionsService {
  constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
    private readonly cameraService: CameraService,
    private readonly cameraLocationService: CameraLocationService,
    private readonly priorityService: PriorityService,
  ) {}

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find();
  }

  async create(
    cDetectionDto: CreateDetectionDto,
  ): Promise<DetectionEntity> {
    console.log(cDetectionDto.timestamp);
    const { camera, cameraLocation } = await this.getDetectionCameraAndLocation(
      cDetectionDto.cameraName,cDetectionDto.timestamp, cDetectionDto.latitude, cDetectionDto.longitude
    );
    console.log(JSON.stringify(camera))
    console.log(JSON.stringify(cameraLocation))
    const detection = this.detectionsRepository.create();
    detection.camera = camera;
    detection.location = cameraLocation;
    detection.category = cDetectionDto.categoryNumber;
    detection.framePath = this.setFramePath(cDetectionDto.frame);
    detection.priority = await this.getPriority(cDetectionDto.priorityName);
    // detection.statusId = this.getStatusId();
    detection.timestamp = new Date(cDetectionDto.timestamp);
    return this.detectionsRepository.save(detection);
  }

  async getPriority(priorityName: string): Promise<PriorityEntity> {
    let priority: PriorityEntity = await this.priorityService.findByName(priorityName);
    if(!priority)
      priority = await this.priorityService.create({ priorityName: priorityName });
    return priority;
  }

  getLocationId(latitude: number, longitude: number): string {
    return `ufbaLocation`;
  }

  setFramePath(frame: string): string {
    return `c:/detection_frames/frameName`;
  }


  async getDetectionCameraAndLocation(cameraName: string, timestamp: Date, latitude?: number, longitude?: number) {
    let camera: CameraEntity = await this.cameraService.findByName(cameraName);
    let cameraLocation: CameraLocationEntity;

    if (!longitude || !latitude) {
      if (!camera) {
        throw new BadRequestException('Camera location incomplete. Please, provide latitude and longitude.');
      }
      
      cameraLocation = await this.cameraLocationService.findActiveByCameraId(camera.cameraId);
    } else {
      console.log("aqui")
      if (!camera) {
        camera = await this.cameraService.create({ name: cameraName, hasGps: true });
      }

      console.log(JSON.stringify(camera))
      cameraLocation = await this.cameraLocationService.findActiveByCameraId(camera.cameraId);
      
      if (cameraLocation) {
        console.log("cá")
        console.log(cameraLocation.latitude)
        console.log(latitude)
        console.log(cameraLocation.longitude)
        console.log(longitude)
        if (cameraLocation.latitude != latitude || cameraLocation.longitude != longitude) {
          
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
        cameraLocation = await this.cameraLocationService.create({
          camera: camera,
          latitude: latitude,
          longitude: longitude,
          isActive: true,
          timestamp: timestamp
        });
        
      }
    }

    return { camera, cameraLocation };
  }

}

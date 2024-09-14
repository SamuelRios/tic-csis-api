import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetectionsDto } from './dto/create-detections.dto';
import { DetectionEntity } from './entities/detection.entity';

@Injectable()
export class DetectionsService {
  constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
  ) {}

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find();
  }

  async create(
    createDetectionsDto: CreateDetectionsDto,
  ): Promise<DetectionEntity> {
    console.log(JSON.stringify(createDetectionsDto));
    const detection = this.detectionsRepository.create();
    console.log('created detection:');
    console.log(detection.detectionId);
    console.log(createDetectionsDto.timestamp);
    detection.cameraId = this.getCameraIdByCameraName();
    detection.category = createDetectionsDto.categoryNumber;
    detection.framePath = this.setFramePath(createDetectionsDto.frame);
    detection.locationId = this.getLocationId(
      createDetectionsDto.latitude,
      createDetectionsDto.longitude,
    );
    detection.priorityId = this.getPriorityId();
    detection.statusId = this.getStatusId();
    detection.timestamp = new Date(createDetectionsDto.timestamp);

    console.log(detection.timestamp);
    return this.detectionsRepository.save(detection);
  }

  getStatusId(): number {
    return 1234;
  }

  getPriorityId(): number {
    return 1234;
  }

  getLocationId(latitude: number, longitude: number): string {
    return `ufbaLocation`;
  }

  setFramePath(frame: string): string {
    return `c:/detection_frames/frameName`;
  }
  getCameraIdByCameraName(): number {
    return 1234;
  }
}

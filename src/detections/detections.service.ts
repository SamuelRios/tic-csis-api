import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetectionsDto } from './dto/create-detections.dto';
import { DetectionEntity } from './entities/detections.entity';

@Injectable()
export class DetectionsService {
constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
  ) {}

  async create(createDetectionsDto: CreateDetectionsDto): Promise<DetectionEntity> {

    const detection = this.detectionsRepository.create(createDetectionsDto);
    return this.detectionsRepository.save(detection);
  }

  async deleteById(id: number): Promise<void> {
    await this.detectionsRepository.delete(id);
  }

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find()
    
  }
}

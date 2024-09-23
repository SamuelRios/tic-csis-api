import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { DetectionEntity } from './entities/detection.entity';

@Injectable()
export class DetectionsService {
constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
  ) {}

  async create(createDetectionDto: CreateDetectionDto): Promise<DetectionEntity> {

    const detection = this.detectionsRepository.create(createDetectionDto);
    return this.detectionsRepository.save(detection);
  }

  async deleteById(id: number): Promise<void> {
    await this.detectionsRepository.delete(id);
  }

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find()
    
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { DetectionsService } from './services/detections.service';
import { DetectionEntity } from './entities/detection.entity';

@Controller('detections')
export class DetectionsController {
  constructor(private readonly detectionsService: DetectionsService) {}

  @Get()
  async getAll(): Promise<DetectionEntity[]> {
    return await this.detectionsService.findAll();
  }

  @Post()
  async create(
    @Body() createDetectionsDto: CreateDetectionDto,
  ): Promise<DetectionEntity> {
    console.log(JSON.stringify(createDetectionsDto))
    return this.detectionsService.create(createDetectionsDto);
  }
}

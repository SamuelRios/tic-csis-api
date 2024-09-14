import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDetectionsDto } from './dto/create-detections.dto';
import { DetectionsService } from './detections.service';
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
    @Body() createDetectionsDto: CreateDetectionsDto,
  ): Promise<DetectionEntity> {
    return this.detectionsService.create(createDetectionsDto);
  }
}

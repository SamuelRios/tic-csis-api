import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { DetectionsService } from './services/detections.service';
import { DetectionEntity } from './entities/detection.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('detections')
export class DetectionsController {
  constructor(private readonly detectionsService: DetectionsService) {}

  @Get()
  async getAll(): Promise<DetectionEntity[]> {
    return await this.detectionsService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('frame', {
      storage: diskStorage({
        destination: 'C:\\xampp\\htdocs\\dashboardcsis\\imagens\\frames',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    })
  )
  async create(
    @UploadedFile() detectionFrame: Express.Multer.File,
    @Body('data') detectionDataDto: string,
  ): Promise<DetectionEntity> {
    const detectionData: CreateDetectionDto = JSON.parse(detectionDataDto);
    detectionData.framePath = "imagens/frames/" + detectionFrame.filename;
    return this.detectionsService.create(detectionData);
  }
}

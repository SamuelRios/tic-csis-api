import {
  Body,
  Controller,
  Get,
  Param,
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
import { promises as fs } from 'fs';

@Controller('detections')
export class DetectionsController {

  constructor(
    private readonly detectionsService: DetectionsService,
  ) {}

  @Get('active')
  async getActiveDetections(): Promise<DetectionEntity[]> {
    return this.detectionsService.getAllActiveDetections();
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
    const framePath = "imagens/frames/" + detectionFrame.filename;
      return this.detectionsService.create(detectionData, framePath);
  }

  @Post("close/:id")
  async closeDetection(@Param('id') id: number,) {
      console.log("aqui:")
      await this.detectionsService.closeDetection(id);
      return "Fechado.";
  }


}

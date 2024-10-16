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
import { CameraLocationService } from './services/cameraLocation.service';

@Controller('detections')
export class DetectionsController {

  constructor(
    private readonly detectionsService: DetectionsService,
    private readonly locationService: CameraLocationService,
  ) {}

  @Get('active')
  async getActiveDetections(): Promise<DetectionEntity[]> {
    return this.detectionsService.getAllActiveDetections();
  }

  @Get(":id")
  async getDetectionById(@Param('id') id: number): Promise<DetectionEntity>{
    return this.detectionsService.findOneById(id);
  }

  @Get('isclosed/:id')
  async isDetectionClosed(@Param('id') id: number): Promise<boolean> {
    console.log("aqui no is closed router")
    console.log(id)
    const detection: DetectionEntity = await this.detectionsService.findOneById(id);
    console.log(detection)
    if(detection.status.statusId == 2) return true;
    return false;
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

  @Post("changeprioriy/:id/:newPriority")
  async changePriority(@Param('id') detectionId: number, @Param('newPriority') newPriority: string) {
    return this.detectionsService.changeDetectionPriority(detectionId, newPriority);
  }

  @Post("changestatus/:id/:newstatus")
  async changeStatus(@Param('id') detectionId: number, @Param('newstatus') newStatus: string) {
    return this.detectionsService.changeDetectionStatus(detectionId, newStatus);
  }

  @Post("createlocation/")
  async createLocation(@Body('data') locationDataDto: string) {
    // return this.locationService.createLocation(locationDataDto);
  }

  
  


}

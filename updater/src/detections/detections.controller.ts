import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { writeFile } from 'fs/promises';
import * as path from 'path';
import { StatusEntity } from './entities/status.entity';
import { StatusService } from './services/status.service';
import { PriorityEntity } from './entities/priority.entity';
import { PriorityService } from './services/priority.service';
import { UpdateDetectionDto } from './dto/update-detection.dto';

@Controller('detections')
export class DetectionsController {

  constructor(
    private readonly detectionsService: DetectionsService,
    private readonly statusService: StatusService,
    private readonly priorityService: PriorityService,
  ) {}

  @Get('active')
  async getActiveDetections(): Promise<DetectionEntity[]> {
    return this.detectionsService.getAllActiveDetections();
  }

  @Get('getallstatuses')
  async getAllStatuses(): Promise<StatusEntity[]> {
    return await this.statusService.findAll();
  }

  @Get('getallpriorities')
  async getAllPriorities(): Promise<PriorityEntity[]> {
    return await this.priorityService.findAll();
  }

  @Patch(':id')
  async updateDetection(
    @Param('id') id: number,
    @Body() updateDetectionDto: UpdateDetectionDto
  ): Promise<DetectionEntity> {
    return await this.detectionsService.updateDetection(id, updateDetectionDto);
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
    if(detection.status.statusId == 2) return true;
    return false;
  }

  @Post()
  @UseInterceptors(FileInterceptor('frame'))
  async createWithImg(@UploadedFile() frame: Express.Multer.File, @Body('detectionData') detectionData: string): Promise<DetectionEntity> {
    const detection = JSON.parse(detectionData);
    // Define o caminho onde a imagem será salva
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(detection.cameraName);
    const filename = `${uniqueSuffix}${ext}`;
    const imagePath = path.join("C:/xampp/htdocs/dashboardcsis/imagens/frames", filename +  ".png");
    const framePath = "imagens/frames/" + filename;
    if(!frame){
      console.log("não há imagens")
    } else 
      await writeFile(imagePath, frame.buffer);

    return this.detectionsService.create(detection, framePath);

  }


  @Post('withoutimginjson') 
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
  async createWithoutImg(
    @UploadedFile() detectionFrame: Express.Multer.File,
    @Body('data') detectionDataDto: string,
  ): Promise<DetectionEntity> {
    const detectionData: CreateDetectionDto = JSON.parse(detectionDataDto);
    const framePath = "imagens/frames/" + detectionFrame.filename;
      return this.detectionsService.create(detectionData, framePath);
  }

  @Post("close/:id")
  async closeDetection(@Param('id') id: number,) {
      await this.detectionsService.closeDetection(id);
      return "Fechado.";
  }

  @Post("changepriority/:id/:newPriority")
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
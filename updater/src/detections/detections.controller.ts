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
import { promises as fs } from 'fs'; // Importa o módulo fs
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('detections')
export class DetectionsController {

  private urlMonitorAPI = "http://localhost:3000/";

  constructor(
    private readonly detectionsService: DetectionsService,
    private readonly httpService: HttpService
  ) {}

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
    const framePath = "imagens/frames/" + detectionFrame.filename;
    const detection: DetectionEntity = await this.detectionsService.getActiveDetectionByCameraNameAndCategory(detectionData.cameraName, detectionData.category);
    if(!detection)
      return this.detectionsService.create(detectionData, framePath);
    else {
      console.log(detection)
      const filePath = `C:\\xampp\\htdocs\\dashboardcsis\\imagens\\frames\\${detectionFrame.filename}`;
      try {
        await fs.unlink(filePath); // Apaga o arquivo
        console.log(`Arquivo ${filePath} excluído com sucesso.`);
      } catch (error) {
        console.error(`Erro ao excluir o arquivo: ${error.message}`);
      }
      return detection;
    }
  }

  @Post("close/:id")
  async closeDetection(@Param('id') id: number,) {
      const closedDetection: DetectionEntity = await this.detectionsService.closeDetection(id);
      if(closedDetection){
        console.log(closedDetection)
        console.log("limpando cache:")
        console.log(await this.notifyClosedDetection(closedDetection.camera.name, closedDetection.category));
      }
      return "Fechado.";
  }

  async notifyClosedDetection(cameraName: string, category: string){
    try {
     const response = await firstValueFrom(
          this.httpService.post(`${this.urlMonitorAPI}detection/clear/${cameraName}/${category}`),
      );
      if(response?.status == 201)
       return response.data;
    } catch (error) {
        console.log(error)
        console.log("caiu aq no erro 53")
        // console.error('Error fetching data from API', error);
        throw error;
    }
  }

}

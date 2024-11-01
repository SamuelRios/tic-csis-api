import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { CacheService } from '../cache/cache.service';
import { SendDetectionDto } from 'src/dto/send-detection.dto';
import { CategoryEnum } from 'src/enum/category.enum';
import { ConfigService } from '@nestjs/config';
// import * as path from 'path';

@Injectable()
export class ProcessorService {

    private updaterApiUrl;
    // projectPath = path.resolve(__dirname);
    private prefixImagePath;

    constructor(
        private readonly config: ConfigService,
        private readonly cacheService: CacheService,
        private readonly httpService: HttpService
    ) {
        this.prefixImagePath = config.get('PREFIX_IMG_PATH');
        this.updaterApiUrl = config.get('UPDATER_API_URL');
    }

    async process(detectionsData, detectionFrame: Buffer) {
        const timestamp: string = detectionsData.timestamp;
        const detections = detectionsData.detections;
        const cameraName =  detectionsData.camera ? detectionsData.camera : "Camera Default"
        for(const detectionClass of detections){
            let myDetection = {
                cameraName: cameraName,
                timestamp: timestamp,
                categoryNumber: detectionClass.class
            }
            if(!this.cacheService.isDetectionInCache(cameraName, detectionClass.class)){
                try {
                    console.log("vou enviar")
                    const response = await this.sendDetection(myDetection, detectionFrame);
                    if(response) this.cacheService.setDetectionInCache(cameraName, detectionClass.class, response.id);
                } catch {
                    console.log("agora eh na req")
                }
            }
        }
    }

    async sendDetection(detection: Detection, detectionFrame: Buffer): Promise<any> {
        try {
            const sendDetectionDto: SendDetectionDto = {
                cameraName: detection.cameraName,
                category: CategoryEnum.getCategoryName(detection.categoryNumber),
                timestamp: detection.timestamp
            }
            const form = new FormData();
            form.append('frame', detectionFrame, {
                filename: 'frame.png',
                contentType: 'image/png',
              });
            
            form.append('detectionData', JSON.stringify(sendDetectionDto));

            const response = await firstValueFrom(
                this.httpService.post(this.updaterApiUrl + "detections", form, // Dados do formulário
                    {
                    headers: {
                        ...form.getHeaders(), // Headers do form-data
                    },
                    }
                ),
            );
            if(response?.status == 201){
                console.log("Decção enviada.")
            } else {
                console.log("Erro ao salvar detecção ::::::::::::::::::::::::::::::~~~~")
            }
            return response.data;
        } catch (error) {
            console.log("ERROR: sendDetection")

          throw new Error(error.response?.data || 'Error sending JSON data');
        }
      }

      

    async processSavedImg(detectionsData) {
        const timestamp: string = detectionsData.timestamp;
        const detections = detectionsData.detections;
        const cameraName =  detectionsData.camera ? detectionsData.camera : "Camera Default"
        for(const detectionClass of detections){
            let myDetection = {
                cameraName: cameraName,
                timestamp: timestamp,
                categoryNumber: detectionClass.class
            }
            if(!this.cacheService.isDetectionInCache(cameraName, detectionClass.class)){
                try {
                    console.log("vou enviar")
                    const response = await this.sendDetectionSavedImg(myDetection);
                    if(response) this.cacheService.setDetectionInCache(cameraName, detectionClass.class, response.id);
                } catch {
                    console.log("agora eh na req")
                }
            }
        }
    }

    async sendDetectionSavedImg(detection: Detection){
        try {
            const formData = new FormData();
            const categoryName = CategoryEnum.getCategoryName(detection.categoryNumber);

            const sendDetectionDto: SendDetectionDto = {
                cameraName: detection.cameraName,
                category: CategoryEnum.getCategoryName(detection.categoryNumber),
                timestamp: detection.timestamp
            }
            formData.append('detectionData', JSON.stringify(sendDetectionDto));
            console.log(this.prefixImagePath + categoryName +`/${detection.cameraName}_detection_${detection.timestamp.replace(" ","_").replace(/:/g, "-")}.png`)
            formData.append('frame', fs.createReadStream(this.prefixImagePath + categoryName +`/${detection.cameraName}_detection_${detection.timestamp.replace(" ","_").replace(/:/g, "-")}`));

           const response = await firstValueFrom(
                this.httpService.post(this.updaterApiUrl + "detections", formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                }),
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

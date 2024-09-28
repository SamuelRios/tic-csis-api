import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { CacheService } from '../cache/cache.service';
import { SendDetectionDto } from 'src/dto/send-detection.dto';
import { CategoryEnum } from 'src/enum/category.enum';
// import * as path from 'path';

@Injectable()
export class ProcessorService {

    private urlUpdaterApi = 'http://localhost:3001/detections';
    // projectPath = path.resolve(__dirname);
    private prefixImagePath = 'C:/Users/mucar/tic-csis-api/monitor/detection-images/'

    constructor(
        private readonly cacheService: CacheService,
        private readonly httpService: HttpService
    ) {}

    async process(jsonFile) {
        const timestamp: string = jsonFile.timestamp;
        const detections = jsonFile.detections;
        let i = detections[0];
        for(const detectionJson of detections){
            let myDetection = {
                cameraName: "camera1",
                timestamp: timestamp,
                categoryNumber: detectionJson.class,
            }
            if(!this.cacheService.isDetectionInCache(myDetection)){
                try {
                    console.log("vou salvar")
                    const response = await this.sendDetection(myDetection);
                    if(response) this.cacheService.setDectionInCache(myDetection);
                } catch {
                    console.log("agora eh na req")
                }
            }
        }
    }

    async sendDetection(detection: Detection){
        try {
            const formData = new FormData();

            const sendDetectionDto: SendDetectionDto = {
                cameraName: detection.cameraName,
                category: CategoryEnum.getCategoryName(detection.categoryNumber),
                timestamp: detection.timestamp
            }
            formData.append('data', JSON.stringify(sendDetectionDto));
            
            formData.append('frame', fs.createReadStream( this.prefixImagePath + "camera1.png"));

           const response = await firstValueFrom(
                this.httpService.post(this.urlUpdaterApi, formData, {
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

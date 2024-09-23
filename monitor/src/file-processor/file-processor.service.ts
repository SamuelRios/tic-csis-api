import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class FileProcessorService {

    private urlUpdaterApi = 'http://localhost:3001/detections';
    private prefixImagePath = 'C:/Users/Formas/Desktop/tic-csis-api/monitor/detection-images/'

    constructor(private readonly httpService: HttpService) {}

    async processFile(filePath: string, fileName: string) {
        console.log("processando o arquivo \"" + filePath + "\"");
        console.log(fileName, fileName);
        let detection = this.getJsonFromFile(filePath);
        const responseData = await this.sendDetection(detection, fileName);
        console.log(responseData);
    }

    getJsonFromFile(filePath: string){
        const fs = require('fs');
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const jsonData = JSON.parse(data);
          console.log(jsonData);
          return jsonData;
        } catch (err) {
          console.error('Error reading or parsing the file; ', err);
        }
    }

    async sendDetection(detection, fileName){
        
        try {
            const formData = new FormData();
            
            formData.append('frame', fs.createReadStream(this.prefixImagePath + fileName.replace(".json", ".png")));
            formData.append('data', JSON.stringify(detection));

           const response = await firstValueFrom(
                this.httpService.post(this.urlUpdaterApi, formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                }),
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching data from API', error);
            throw error;
        }
    }
}

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { FileProcessorService } from 'src/file-processor/file-processor.service';

@Injectable()
export class FolderMonitorService {
    
    private directoryPath = './detection-files';
    private fileName = 'output.json';

    private simulatedOnce: boolean = false;

    constructor(
        private readonly fileProcessorService: FileProcessorService,
    ) {}

    @Cron('* * * * * *')
    handleCron() {
        fs.readdir(this.directoryPath, (err, files) => {
            if(!this.simulatedOnce){
                if (err) {
                    console.log('Erro ao ler o diretório: ', err.message);
                } else {
                    this.simulatedOnce = true;
                    console.log("run:")
                    if(files.findIndex(fileName => fileName == this.fileName) > -1){ 
                        const filePath = path.join(this.directoryPath, this.fileName);
                        const jsonFile = this.getJsonFromFile(filePath);
                        this.simulateModel(jsonFile)
                        // this.fileProcessorService.processFile( filePath, this.fileName);
                    } else console.log("\"" + this.fileName + "\" file not found");
                }
            }
            
        });
    }

    private timestamp: Date;

    simulateModel(jsonFile){
        console.log('Iniciando execução...');
        setTimeout(() => {
            console.log(jsonFile[0])
            console.log('Finalizando execução...');
            this.simulateModel(jsonFile);
        }, 1000);
    }

    getJsonFromFile(filePath: string){
        const fs = require('fs');
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const jsonData = JSON.parse(data);
        //   console.log(jsonData);
          return jsonData;
        } catch (err) {
            console.log("caiu aq no erro 32")
        //   console.error('Error reading or parsing the file; ', err);
        }
    }
}




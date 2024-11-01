import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { ProcessorService } from 'src/services/processor/processor.service';

@Injectable()
export class Monitor {
    
    private directoryPath = './detection-files';
    private fileName = 'output.json';

    private simulatedOnce: boolean = false;

    constructor(
        private readonly processorService: ProcessorService,
    ) {}

    // @Cron('* * * * * *')
    // handleCron() {
        // fs.readdir(this.directoryPath, async (err, files) => {
        //     if(!this.simulatedOnce){
        //         if (err) {
        //             console.log('Erro ao ler o diretório: ', err.message);
        //         } else {
        //             this.simulatedOnce = true;
        //             console.log("run:")
        //             if(files.findIndex(fileName => fileName == this.fileName) > -1){ 
        //                 const filePath = path.join(this.directoryPath, this.fileName);
        //                 const jsonFile = this.getJsonFromFile(filePath);
        //                 this.simulateModel(jsonFile)
        //                 console.log("finalizei")
        //             } else console.log("\"" + this.fileName + "\" file not found");
        //         }
        //     }
        // });
    // }

    private indexJobSimulator: number = 0;

    simulateModel(jsonFile){
        setTimeout(async () => {
            if(this.indexJobSimulator < jsonFile.length){
                console.log('Iniciando a execução...');
                // await this.processorService.process(jsonFile[this.indexJobSimulator])
                console.log('Fim da execução...');
                this.indexJobSimulator++;
            }
            this.simulateModel(jsonFile);
           
        }, 1000);
    }

    getJsonFromFile(filePath: string){
        const fs = require('fs');
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const jsonData = JSON.parse(data);
          return jsonData;
        } catch (err) {
            console.log("caiu aq no erro 32")
        }
    }
}




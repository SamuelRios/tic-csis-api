import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { FileProcessorService } from 'src/file-processor/file-processor.service';

@Injectable()
export class FolderMonitorService {
    
    private directoryPath = './detection-files';

    constructor(
        private readonly fileProcessorService: FileProcessorService,
    ) {}

    @Cron('* * * * * *')
    handleCron() {
        fs.readdir(this.directoryPath, (err, files) => {
            if (err) {
              console.log('Erro ao ler o diretório: ', err);
            } else {
                console.log("run:")
                if(files.length == 0) console.log("No file was found");
                else console.log(`${files.length} file${files.length > 1 ? 's' : ''} found.`);
                files.forEach(async file => {
                    const filePath = path.join(this.directoryPath, file);
                    await this.fileProcessorService.processFile(filePath, file);
                });
            }
        });
    }
}

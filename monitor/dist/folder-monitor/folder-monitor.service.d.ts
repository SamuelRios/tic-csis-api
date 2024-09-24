import { FileProcessorService } from 'src/file-processor/file-processor.service';
export declare class FolderMonitorService {
    private readonly fileProcessorService;
    private directoryPath;
    private fileName;
    private simulatedOnce;
    constructor(fileProcessorService: FileProcessorService);
    handleCron(): void;
    private timestamp;
    simulateModel(jsonFile: any): void;
    getJsonFromFile(filePath: string): any;
}

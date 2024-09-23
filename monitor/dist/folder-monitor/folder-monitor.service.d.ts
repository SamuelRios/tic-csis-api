import { FileProcessorService } from 'src/file-processor/file-processor.service';
export declare class FolderMonitorService {
    private readonly fileProcessorService;
    private directoryPath;
    constructor(fileProcessorService: FileProcessorService);
    handleCron(): void;
}

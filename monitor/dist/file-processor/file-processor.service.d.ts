import { HttpService } from '@nestjs/axios';
export declare class FileProcessorService {
    private readonly httpService;
    private urlUpdaterApi;
    private prefixImagePath;
    constructor(httpService: HttpService);
    processFile(filePath: string, fileName: string): Promise<void>;
    getJsonFromFile(filePath: string): any;
    sendDetection(detection: any, fileName: any): Promise<any>;
}

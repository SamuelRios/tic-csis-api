import { CacheService } from './services/cache/cache.service';
export declare class AppController {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    clearDetectionCache(cameraName: string, category: number): string;
}

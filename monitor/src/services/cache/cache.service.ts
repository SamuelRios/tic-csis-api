import { Injectable } from '@nestjs/common';
import { CategoryEnum } from 'src/enum/category.enum';

@Injectable()
export class CacheService {
    
    private cacheTTL = 60000;
    private breakTime = 60000;
    private detectionsCache: Record<string, Record<number, { timestamp: number, lastChecked: number }>> = {};

    constructor() {
        setInterval(
            () => this.cleanExpiredCache(), this.breakTime
        );
    }

    setDetectionInCache(detection: Detection) {
        const now = Date.now();
        let cameraCache = this.detectionsCache[detection.cameraName];
        if (!cameraCache) {
            cameraCache = {};
            this.detectionsCache[detection.cameraName] = cameraCache;
        }
        cameraCache[detection.categoryNumber] = { timestamp: now, lastChecked: now };
    }

    isDetectionInCache(detection: Detection): boolean {
        console.log("verificando se esta no cache")
        const cameraCache = this.detectionsCache[detection.cameraName];
        const now = Date.now();

        if (cameraCache) {
            const detectionData = cameraCache[detection.categoryNumber];
            if (detectionData) {
                const { timestamp, lastChecked } = detectionData;
                console.log(timestamp)
                console.log(now)
                console.log(now - timestamp)
                if (now - timestamp <= this.cacheTTL && now - lastChecked <= CategoryEnum.getDebounceTTL(detection.categoryNumber)) {
                    detectionData.lastChecked = now;
                    return true;
                } else {
                    this.clearDetectionCache(detection);
                    return false;
                }
            }
        }
        return false;
    }

    clearDetectionCache(detection: Detection) {
        console.log("Limpando detecção do cache")
        const cameraCache = this.detectionsCache[detection.cameraName];
        if (cameraCache) {
            delete cameraCache[detection.categoryNumber];
            if (Object.keys(cameraCache).length === 0) {
                delete this.detectionsCache[detection.cameraName];
            }
        }
    }

    cleanExpiredCache() {
        const now = Date.now();
        console.log("Verificando caches expirados:::::::::::::::::::::::::::::::::::::::::::::::::")
        for (const cameraName in this.detectionsCache) {
            const cameraCache = this.detectionsCache[cameraName];
            for (const categoryNumberStr in cameraCache) { 
                const categoryNumber = Number(categoryNumberStr);
                const { timestamp, lastChecked } = cameraCache[categoryNumber];
                if (now - timestamp > this.cacheTTL) {
                    delete cameraCache[categoryNumber];
                } else if (now - lastChecked > CategoryEnum.getDebounceTTL(categoryNumber)) {
                    delete cameraCache[categoryNumber];
                }
            }

            if (Object.keys(cameraCache).length === 0) {
                delete this.detectionsCache[cameraName];
            }
        }
    }

}

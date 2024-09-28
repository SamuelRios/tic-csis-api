import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {

    private detectionsCache: Record<string, Set<number>> = {};

    setDectionInCache(detection: Detection) {
        let camera1Cache = this.detectionsCache[detection.cameraName];
        if (!camera1Cache) {
            camera1Cache = new Set<number>();
            this.detectionsCache[detection.cameraName] = camera1Cache;  // Corrige o erro de atribuição
        }
        camera1Cache.add(detection.categoryNumber);
    }

    isDetectionInCache(detection: Detection) {
        const camera1Cache = this.detectionsCache[detection.cameraName];
        if (camera1Cache) return camera1Cache.has(detection.categoryNumber);
        return false;
    }

    clearDetectionCache(detection: Detection) {
        const cameraCache = this.detectionsCache[detection.cameraName];
        if (cameraCache) {
            cameraCache.delete(detection.categoryNumber);
            if (cameraCache.size === 0) {
                delete this.detectionsCache[detection.cameraName];
            }
        }
    }
}

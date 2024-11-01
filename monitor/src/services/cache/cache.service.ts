import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CategoryEnum } from 'src/enum/category.enum';

@Injectable()
export class CacheService {
    private updaterApiUrl;
    
    private cacheTTL = 60000; // Tempo de vida do cache em milissegundos
    private checkIntervalTime = 30000; // Intervalo de verificação do cache
    private detectionsCache: Record<string, Record<number, { detectionId: number, lastCheckedClosedDetection: number, lastCheckedDebounce: number }>> = {};

    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.updaterApiUrl = config.get('UPDATER_API_URL');
        // Intervalo para limpar o cache automaticamente
        setInterval(() => this.cleanExpiredCache(), this.checkIntervalTime);
    }

    // Define a última detecção no cache para uma categoria de uma câmera
    setDetectionInCache(cameraName: string, categoryNumber: number, detectionId: number) {
        const now = Date.now();
        let cameraCache = this.detectionsCache[cameraName];

        if (!cameraCache) {
            cameraCache = {};
            this.detectionsCache[cameraName] = cameraCache;
        }

        // Sobrescreve a detecção anterior, mantendo apenas a última para essa categoria
        cameraCache[categoryNumber] = { 
            detectionId: detectionId, 
            lastCheckedClosedDetection: now, 
            lastCheckedDebounce: now 
        };
    }

    // Verifica se uma detecção já está no cache
    isDetectionInCache(cameraName: string, categoryNumber: number): boolean {
        console.log("Verificando se está no cache");
        const cameraCache = this.detectionsCache[cameraName];
        const now = Date.now();

        if (cameraCache) {
            const detectionCache = cameraCache[categoryNumber];
            if (detectionCache) {
                // Verifica se a detecção é válida com base no TTL e debounce
                if (now - detectionCache.lastCheckedClosedDetection <= this.cacheTTL &&
                    now - detectionCache.lastCheckedDebounce <= CategoryEnum.getDebounceTTL(categoryNumber)) {
                    
                    // Atualiza o tempo de verificação
                    detectionCache.lastCheckedClosedDetection = now;
                    return true;
                } else {
                    // Limpa o cache se a detecção estiver expirada
                    this.deleteDetectionCache(cameraName, categoryNumber);
                    return false;
                }
            }
        }
        return false;
    }

    // Limpa o cache para uma categoria específica de uma câmera
    deleteDetectionCache(cameraName: string, categoryNumber: number) {
        console.log("Limpando detecção do cache");
        const cameraCache = this.detectionsCache[cameraName];
        if (cameraCache) {
            delete cameraCache[categoryNumber];

            // Remove a câmera se não houver mais categorias
            if (Object.keys(cameraCache).length === 0) {
                delete this.detectionsCache[cameraName];
            }
        }
    }

    // Limpa detecções expiradas do cache
    async cleanExpiredCache() {
        const now = Date.now();
        console.log("Verificando caches expirados:::::::::::::::::::::::::::::::::::::::::::::::::");
        
        for (const cameraName in this.detectionsCache) {
            const cameraCache = this.detectionsCache[cameraName];

            for (const categoryNumberStr in cameraCache) {
                const categoryNumber = Number(categoryNumberStr);
                const detectionCache = cameraCache[categoryNumber];

                // Verifica se a detecção está expirada com base no TTL ou debounce
                if ((now - detectionCache.lastCheckedClosedDetection > this.cacheTTL)){
                    if(await this.isDetectionClosed(detectionCache.detectionId)) this.deleteDetectionCache(cameraName, categoryNumber)
                    else detectionCache.lastCheckedClosedDetection = now;
                }
                if (now - detectionCache.lastCheckedDebounce > CategoryEnum.getDebounceTTL(categoryNumber)) {
                    this.deleteDetectionCache(cameraName, categoryNumber);
                }
            }

            // Remove a câmera se não houver mais categorias
            if (Object.keys(cameraCache).length === 0) {
                delete this.detectionsCache[cameraName];
            }
        }
    }


    async isDetectionClosed(detectionId){
        try {
            const response = await firstValueFrom(
                this.httpService.get(this.updaterApiUrl + `detections/isclosed/${detectionId}`)
            );
            if(response?.status == 200)
                return !!response.data;
            return true; // Retorna o conteúdo da resposta
        } catch (error) {
        throw new Error(`Erro ao fazer a requisição: ${error.message}`);
        }
    }
}

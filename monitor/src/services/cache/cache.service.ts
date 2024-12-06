import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CacheService {
    private updaterApiUrl;
    
    private cacheTTL = 60000; // Tempo de vida do cache em milissegundos
    private checkIntervalTime = 30000; // Intervalo de verificação do cache
    private detectionsCache: Record<string, Record<number, { detectionId: number, lastCheckedClosedDetection: number, lastCheckedDebounce: number }>> = {};

    private debounceTTL = {
        "spray": 300000,
        "graffiti": 300000,
        "gun": 300000,
        "fire": 300000,
        "smoke": 300000,
        "knife": 300000,
        "puddle": 300000,
        "mud": 300000,
        "person": 300000,
    };

    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.updaterApiUrl = this.config.get('UPDATER_API_URL');
        // Intervalo para limpar o cache automaticamente
        setInterval(() => this.cleanExpiredCache(), this.checkIntervalTime);
    }

    // Define a última detecção no cache para uma categoria de uma câmera
    public setDetectionInCache(cameraName: string, categoryNumber: number, detectionId: number) {
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
    public async isDetectionInCache(cameraName: string, category: string): Promise<boolean> {
        console.log("Verificando se está no cache");
        const cameraCache = this.detectionsCache[cameraName];
        const now = Date.now();

        if (cameraCache) {
            const detectionCache = cameraCache[category];
    
            if (detectionCache) {
                // Verifica se a detecção é válida com base no TTL e debounce

                if(now - detectionCache.lastCheckedDebounce > this.debounceTTL[category]) {
                    this.deleteDetectionCache(cameraName, category);
                    return false;
                } // Atualiza o tempo de verificação
                else detectionCache.lastCheckedDebounce = now;

                if (now - detectionCache.lastCheckedClosedDetection > this.cacheTTL){
                    if(await this.isDetectionClosed(detectionCache.detectionId)){
                        this.deleteDetectionCache(cameraName, category)
                        return false;
                    }
                    else detectionCache.lastCheckedClosedDetection = now;
                }
            }
        }
        return false;
    }

    // Limpa o cache para uma categoria específica de uma câmera
    public deleteDetectionCache(cameraName: string, category: string) {
        console.log("Limpando detecção do cache");
        const cameraCache = this.detectionsCache[cameraName];
        if (cameraCache) {
            delete cameraCache[category];

            // Remove a câmera se não houver mais categorias
            if (Object.keys(cameraCache).length === 0) {
                delete this.detectionsCache[cameraName];
            }
        }
    }

    // Limpa detecções expiradas do cache
    private async cleanExpiredCache() {
        const now = Date.now();
        console.log("Verificando caches expirados:::::::::::::::::::::::::::::::::::::::::::::::::");
        
        for (const cameraName in this.detectionsCache) {
            const cameraCache = this.detectionsCache[cameraName];

            for (const category in cameraCache) {
                const detectionCache = cameraCache[category];

                // Verifica se a detecção está expirada com base no TTL ou debounce
                if ((now - detectionCache.lastCheckedClosedDetection > this.cacheTTL)){
                    if(await this.isDetectionClosed(detectionCache.detectionId)) this.deleteDetectionCache(cameraName, category)
                    else detectionCache.lastCheckedClosedDetection = now;
                }
                if (now - detectionCache.lastCheckedDebounce > this.debounceTTL[category]) {
                    this.deleteDetectionCache(cameraName, category);
                }
            }

            // Remove a câmera se não houver mais categorias
            if (Object.keys(cameraCache).length === 0) {
                delete this.detectionsCache[cameraName];
            }
        }
    }


    private async isDetectionClosed(detectionId){
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

import { Controller, Param, Post } from '@nestjs/common';
import { CacheService } from './services/cache/cache.service';

@Controller("/detection")
export class AppController {
  constructor(private readonly cacheService: CacheService) {}


  @Post('clear/:cameraName/:category')
  clearDetectionCache(
    @Param('cameraName') cameraName: string,
    @Param('category') category: number
  ) {
    const detection: Detection = {
      cameraName,
      categoryNumber: category,
      timestamp: undefined
    }
    
    this.cacheService.clearDetectionCache(detection);
    console.log(`Cache limpo para a câmera: ${cameraName} e categoria: ${category}`)
    return `Cache limpo para a câmera: ${cameraName} e categoria: ${category}`;
  }
}

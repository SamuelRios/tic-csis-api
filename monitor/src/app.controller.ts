import { Controller, Param, Post } from '@nestjs/common';
import { CacheService } from './services/cache/cache.service';

@Controller("/detection")
export class AppController {
  constructor(private readonly cacheService: CacheService) {}


  @Post('clear/:cameraName/:category')
  clearDetectionCache(
    @Param('cameraName') cameraName: string,
    @Param('category') category: string,
  ) {
    this.cacheService.deleteDetectionCache(cameraName, category);
    console.log(`Cache limpo para a câmera: ${cameraName} e categoria: ${category}`)
    return `Cache limpo para a câmera: ${cameraName} e categoria: ${category}`;
  }
}

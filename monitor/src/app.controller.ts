import { Controller, Param, Post } from '@nestjs/common';
import { CacheService } from './services/cache/cache.service';
import { CategoryEnum } from './enum/category.enum';

@Controller("/detection")
export class AppController {
  constructor(private readonly cacheService: CacheService) {}


  @Post('clear/:cameraName/:category')
  clearDetectionCache(
    @Param('cameraName') cameraName: string,
    @Param('category') category: string,
  ) {
    const categoryNumber = CategoryEnum.getCategoryNumber(category);
    this.cacheService.deleteDetectionCache(cameraName, categoryNumber);
    console.log(`Cache limpo para a câmera: ${cameraName} e categoria: ${category}`)
    return `Cache limpo para a câmera: ${cameraName} e categoria: ${category}`;
  }
}

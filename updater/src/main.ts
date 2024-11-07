import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas no DTO
    forbidNonWhitelisted: true, // Retorna erro se propriedades não definidas no DTO forem enviadas
    transform: true, // Transforma os objetos para os tipos esperados
  }));
  // app.use(bodyParser.json({limit: '50mb'}));
  // app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  await app.listen(3001, '0.0.0.0');
}
bootstrap();

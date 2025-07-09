import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activa la validación global para todos los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // --- ESTA ES LA LÍNEA QUE FALTA Y QUE SOLUCIONA EL ERROR ---
  // Habilita CORS para permitir que tu frontend se comunique con el backend.
  app.enableCors();
  // -----------------------------------------------------------

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
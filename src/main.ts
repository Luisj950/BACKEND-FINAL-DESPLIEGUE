// src/main.ts

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // ✅ CORRECCIÓN: Usamos una versión más compatible de la configuración de CORS.
  app.enableCors({
    origin: [
      'https://piensa-fronted-despliegue-56rk.vercel.app', // Tu frontend en producción
      'http://localhost:5173', // Tu frontend en desarrollo (ajusta el puerto si es diferente)
    ],
    credentials: true, // Permite el envío de credenciales (tokens, cookies)
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
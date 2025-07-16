import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MensajeChat } from './entities/mensaje-chat.entity'; // ✅ Correcto si estás en src/chat/
import { JwtModule } from '@nestjs/jwt'; // 👈 1. Se importa JwtModule
import { ConfigModule, ConfigService } from '@nestjs/config'; // 👈 2. Se importan para leer la configuración

@Module({
  imports: [
    TypeOrmModule.forFeature([MensajeChat]),

    // 👇 3. Se añade y configura JwtModule
    // Se usa 'registerAsync' para poder inyectar ConfigService y leer
    // de forma segura la clave secreta desde las variables de entorno.
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importamos ConfigModule para que el factory tenga acceso a ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lee la clave secreta del .env
        signOptions: { expiresIn: '1d' }, // Define el tiempo de expiración de los tokens
      }),
      inject: [ConfigService], // Inyecta ConfigService en el factory
    }),
  ],
  providers: [ChatGateway, ChatService],

})
export class ChatModule {}
// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static'; // ✅ 1. Importa el módulo
import { join } from 'path'; // ✅ 2. Importa 'join' de path
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { ClinicasModule } from './clinicas/clinicas.module';
import { ChatModule } from './chat/chat.module';
import { CitasModule } from './citas/citas.module'; 

@Module({
  imports: [
    // ✅ 3. Añade esta configuración para servir archivos estáticos
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: String(configService.get('DB_PASSWORD')),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true, 
        synchronize: true,
        logging: ['query', 'error'],
      }),
    }),
    
    // --- Módulos de la Aplicación ---
    AuthModule,
    UsersModule,
    MascotasModule,
    HistoriasClinicasModule,
    ClinicasModule,
    ChatModule,
    CitasModule,
  ],
})
export class AppModule {}
// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { ClinicasModule } from './clinicas/clinicas.module';
import { ChatModule } from './chat/chat.module';
import { CitasModule } from './citas/citas.module'; 

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // ✅ --- CONFIGURACIÓN DE TYPEORM CORREGIDA ---
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Si la variable DATABASE_URL existe (en producción en Render), la usamos.
        if (configService.get<string>('DATABASE_URL')) {
          return {
            type: 'postgres',
            url: configService.get<string>('DATABASE_URL'),
            ssl: {
              rejectUnauthorized: false, // Requerido para conexiones en Render
            },
            autoLoadEntities: true, 
            synchronize: true, // Advertencia: ver nota abajo
            logging: ['query', 'error'],
          };
        } else {
          // Si no, usamos la configuración local (para desarrollo).
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: String(configService.get('DB_PASSWORD')),
            database: configService.get<string>('DB_DATABASE'),
            autoLoadEntities: true, 
            synchronize: true,
            logging: ['query', 'error'],
          };
        }
      },
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
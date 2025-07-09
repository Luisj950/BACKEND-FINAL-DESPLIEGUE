import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos principales existentes
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// --- NUEVOS MÓDULOS PARA IMPORTAR ---
import { MascotasModule } from './mascotas/mascotas.module';
import { ClinicasModule } from './clinicas/clinicas.module';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { TratamientosModule } from './tratamientos/tratamientos.module';
import { CitasModule } from './citas/citas.module';
import { MonitoreoModule } from './monitoreo/monitoreo.module';
import { ChatModule } from './chat/chat.module';
import { RepositorioModule } from './repositorio/repositorio.module';

@Module({
  imports: [
    // --- MÓDULOS DE CONFIGURACIÓN ---
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
      envFilePath: '.env', // Especifica la ruta a tu archivo .env
    }),
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
        autoLoadEntities: true, // Carga automáticamente todas las entidades registradas
        synchronize: true,      // Sincroniza el esquema de la BD (solo para desarrollo)
        logging: ['query', 'error', 'schema'], // <--- ¡ESTO ES LO IMPORTANTE PARA LA DEPURACIÓN!
      }),
    }),

    // --- MÓDULOS DE FUNCIONALIDADES ---
    UsersModule,
    AuthModule,
    MascotasModule,
    ClinicasModule,
    HistoriasClinicasModule,
    TratamientosModule,
    CitasModule,
    MonitoreoModule,
    ChatModule,
    RepositorioModule,
  ],
  controllers: [], // Los controladores se definen dentro de sus módulos específicos
  providers: [],   // Los proveedores se definen dentro de sus módulos específicos
})
export class AppModule {}
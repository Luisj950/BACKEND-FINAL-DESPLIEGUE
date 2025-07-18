import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// --- Importación de Módulos ---
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { ClinicasModule } from './clinicas/clinicas.module';
import { ChatModule } from './chat/chat.module'; // ✅ 1. Importa TODOS tus módulos
import { CitasModule } from './citas/citas.module'; 

@Module({
  imports: [
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
        
        // ✅ 2. Usa autoLoadEntities. Esto descubre todas las entidades automáticamente.
        autoLoadEntities: true, 
        
        // Ya no necesitas la lista manual de "entities: [...]"

        synchronize: true,
        logging: ['query', 'error'],
      }),
    }),
    // ✅ 3. Asegúrate de que TODOS tus módulos estén registrados aquí
    UsersModule,
    AuthModule,
    MascotasModule,
    HistoriasClinicasModule,
    ClinicasModule,
    ChatModule,
    CitasModule,
  ],
})
export class AppModule {}
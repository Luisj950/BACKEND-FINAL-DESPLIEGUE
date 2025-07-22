// src/mascotas/mascotas.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { MascotasController } from './mascotas.controller';
import { MascotasService } from './mascotas.service';
import { MonitoreoModule } from '../monitoreo/monitoreo.module';
// import { AuthModule } from '../auth/auth.module'; // ❌ 1. ELIMINA ESTA LÍNEA

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascota]),
    forwardRef(() => MonitoreoModule),
    // AuthModule, // ❌ 2. ELIMINA ESTA LÍNEA TAMBIÉN
  ],
  controllers: [MascotasController],
  providers: [MascotasService],
  exports: [TypeOrmModule], // Este export es opcional, puedes quitarlo si no lo necesitas
})
export class MascotasModule {}
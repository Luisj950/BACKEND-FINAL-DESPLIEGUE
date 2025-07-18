// src/mascotas/mascotas.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascota } from './entities/mascota.entity';
import { MascotasController } from './mascotas.controller';
import { MascotasService } from './mascotas.service';
import { MonitoreoModule } from '../monitoreo/monitoreo.module'; // ✅ Importar MonitoreoModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascota]),
    forwardRef(() => MonitoreoModule), // ✅ Añadir forwardRef a MonitoreoModule
  ],
  controllers: [MascotasController],
  providers: [MascotasService],
  exports: [TypeOrmModule], // ✅ Asegúrate de exportar TypeOrmModule
})
export class MascotasModule {}
// src/monitoreo/monitoreo.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoreoAlerta } from './entities/monitoreo-alerta.entity';
import { MascotasModule } from '../mascotas/mascotas.module'; // ✅ Importar MascotasModule

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitoreoAlerta]),
    forwardRef(() => MascotasModule), // ✅ Añadir forwardRef a MascotasModule
  ],
  controllers: [], // tus controllers si los tienes
  providers: [],   // tus services si los tienes
  exports: [TypeOrmModule], // ✅ Asegúrate de exportar TypeOrmModule
})
export class MonitoreoModule {}
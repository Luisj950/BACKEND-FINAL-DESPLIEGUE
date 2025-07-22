// src/citas/citas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]), // Importa la entidad Cita
  ],
  controllers: [CitasController], // Registra el controlador
  providers: [CitasService],       // Registra el servicio
})
export class CitasModule {}
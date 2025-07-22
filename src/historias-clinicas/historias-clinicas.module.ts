// src/historias-clinicas/historias-clinicas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { HistoriasClinicasController } from './historias-clinicas.controller';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { AtencionMedica } from './entities/atencion-medica.entity';
import { Mascota } from '../mascotas/entities/mascota.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoriaClinica, 
      AtencionMedica, 
      Mascota, // Importante registrarla aquí porque el servicio la utiliza
    ])
  ],
  controllers: [HistoriasClinicasController],
  providers: [HistoriasClinicasService],
})
export class HistoriasClinicasModule {}
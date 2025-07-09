import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriaClinica } from '../users/entities/historia-clinica.entity';
import { DetalleHistoriaClinica } from '../users/entities/detalle-historia-clinica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoriaClinica, 
      DetalleHistoriaClinica
    ])
  ],
})
export class HistoriasClinicasModule {}
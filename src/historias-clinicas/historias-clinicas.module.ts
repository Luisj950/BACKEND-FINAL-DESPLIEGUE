import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { HistoriasClinicasController } from './historias-clinicas.controller';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { AtencionMedica } from './entities/atencion-medica.entity';
import { MascotasModule } from '../mascotas/mascotas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriaClinica, AtencionMedica]),
    forwardRef(() => MascotasModule), // ✅ Usa forwardRef aquí también
  ],
  controllers: [HistoriasClinicasController],
  providers: [HistoriasClinicasService],
  exports: [TypeOrmModule],
})
export class HistoriasClinicasModule {}
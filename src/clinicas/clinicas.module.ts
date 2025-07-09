import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicaVeterinaria } from '../users/entities/clinica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicaVeterinaria])
  ],
})
export class ClinicasModule {}
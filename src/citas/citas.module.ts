import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from '../users/entities/cita.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita])
  ],
})
export class CitasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tratamiento } from '../clinicas/entities/tratamiento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tratamiento])
  ],
})
export class TratamientosModule {}
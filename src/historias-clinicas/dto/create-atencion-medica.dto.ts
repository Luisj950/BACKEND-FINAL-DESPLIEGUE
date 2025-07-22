// src/historias-clinicas/dto/create-atencion-medica.dto.ts

import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { CategoriaAtencion } from '../entities/atencion-medica.entity';

export class CreateAtencionMedicaDto {
  @IsEnum(CategoriaAtencion)
  @IsNotEmpty()
  categoria: CategoriaAtencion;

  @IsString()
  @IsNotEmpty()
  anamnesis: string;

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
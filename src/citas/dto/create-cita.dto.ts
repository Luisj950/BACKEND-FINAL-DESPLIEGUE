// src/citas/dto/create-cita.dto.ts

import { IsInt, IsDateString, IsEnum, IsString, IsOptional, Min } from 'class-validator';
import { TipoCita } from '../entities/cita.entity';

export class CreateCitaDto {
  @IsDateString()
  fechaHoraInicio: string;

  @IsInt()
  @Min(15) // Duración mínima de 15 minutos
  duracionMinutos: number;

  @IsEnum(TipoCita)
  tipo: TipoCita;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsInt()
  mascotaId: number;

  @IsInt()
  veterinarioId: number;
}
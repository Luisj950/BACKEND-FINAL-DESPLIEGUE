// src/mascotas/dto/update-mascota.dto.ts

import { IsString, IsOptional, IsDateString, IsEnum, IsArray, IsUrl } from 'class-validator';
import { SexoMascota } from '../enums/sexo.enum'; // 👈 Se importa el enum también aquí

export class UpdateMascotaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  especie?: string;

  @IsString()
  @IsOptional()
  raza?: string;

  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  // ✅ Se usa el enum aquí también
  @IsEnum(SexoMascota)
  @IsOptional()
  sexo?: SexoMascota;

  @IsString()
  @IsOptional()
  color?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  imagenUrls?: string[];
}
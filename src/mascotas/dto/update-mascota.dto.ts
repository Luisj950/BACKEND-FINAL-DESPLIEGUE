// src/mascotas/dto/update-mascota.dto.ts

import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { SexoMascota } from '../enums/sexo.enum';

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

  @IsEnum(SexoMascota)
  @IsOptional()
  sexo?: SexoMascota;

  @IsString()
  @IsOptional()
  color?: string;

  // Se elimina 'imagenUrls'. El controlador se encargará de gestionar 
  // los archivos subidos y actualizar las URLs correspondientes.
}
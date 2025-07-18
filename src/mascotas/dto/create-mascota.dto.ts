// src/mascotas/dto/create-mascota.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsArray, IsUrl } from 'class-validator';
import { SexoMascota } from '../enums/sexo.enum'; // 👈 1. Importa el enum

export class CreateMascotaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsString()
  @IsNotEmpty()
  raza: string;

  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  // ✅ 2. Usa el enum para validar el campo 'sexo'
  @IsEnum(SexoMascota)
  @IsNotEmpty()
  sexo: SexoMascota;

  @IsString()
  @IsOptional()
  color?: string;

  // Para las imágenes, esperamos un array de URLs (strings)
  @IsArray()
  @IsUrl({}, { each: true }) // Valida que cada elemento del array sea una URL
  @IsOptional()
  imagenUrls?: string[];
}
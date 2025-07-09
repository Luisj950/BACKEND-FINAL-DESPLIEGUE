import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

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
  fechaNacimiento: Date;

  @IsString()
  @IsNotEmpty()
  sexo: string;

  @IsString()
  @IsOptional()
  color?: string;
}
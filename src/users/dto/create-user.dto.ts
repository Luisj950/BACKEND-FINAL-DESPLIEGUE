import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Rol } from '../enums/rol.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @IsNotEmpty()
  password: string;

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}
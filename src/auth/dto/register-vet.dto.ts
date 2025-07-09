// src/auth/dto/register-vet.dto.ts

import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterVetDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombres: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  apellidos: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'La especialidad es requerida' })
  especialidad: string;

  // Puedes añadir más campos específicos para veterinarios aquí si es necesario
  // Por ejemplo:
  // @IsString()
  // @IsNotEmpty()
  // numeroLicencia: string;
}
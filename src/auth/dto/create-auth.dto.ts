// Asegúrate de haber instalado los paquetes:
// npm install class-validator class-transformer

import { 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    Matches, 
    MinLength 
} from 'class-validator';

export class CreateAuthDto {

    @IsString({ message: 'Los nombres deben ser texto.' })
    @IsNotEmpty({ message: 'Los nombres no pueden estar vacíos.' })
    nombres: string;

    @IsString({ message: 'Los apellidos deben ser texto.' })
    @IsNotEmpty({ message: 'Los apellidos no pueden estar vacíos.' })
    apellidos: string;

    // Se valida que sea un email con formato correcto y que no esté vacío.
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
    correo: string;

    // El teléfono es opcional. Si se envía, se valida que sea texto.
    // Si fuera obligatorio, se usaría @IsNotEmpty en lugar de @IsOptional.
    @IsString()
    @IsOptional()
    telefono?: string; 

    // Se aplican múltiples reglas a la contraseña para hacerla segura.
    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'La contraseña es débil. Debe contener al menos una mayúscula, una minúscula y un número o caracter especial.'
    })
    password: string;
}
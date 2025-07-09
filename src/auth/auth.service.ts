// src/auth/auth.service.ts

import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException 
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegisterVetDto } from './dto/register-vet.dto';
import { Rol } from '../users/enums/rol.enum'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Autentica a un usuario y devuelve un token JWT si las credenciales son válidas.
   */
  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    const isPasswordMatching = user ? await bcrypt.compare(loginDto.password, user.password) : false;

    if (!user || !isPasswordMatching) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      rol: user.rol 
    };

    return {
      message: 'Login exitoso',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Registra un nuevo usuario con el rol de PROPIETARIO por defecto.
   * Llama al servicio de usuarios para manejar la lógica de creación.
   */
  async register(createUserDto: CreateUserDto) {
    // Llama al método 'create' unificado en UsersService,
    // forzando el rol a PROPIETARIO para el registro público.
    return this.usersService.create({
      ...createUserDto,
      rol: Rol.PROPIETARIO,
    });
  }

  /**
   * Registra un nuevo veterinario con el rol de VETERINARIO_PENDIENTE.
   * La cuenta deberá ser aprobada por un administrador.
   */
  async registerAsVet(registerVetDto: RegisterVetDto) {
    // Llama al método 'create' unificado en UsersService,
    // forzando el rol a VETERINARIO_PENDIENTE.
    return this.usersService.create({
      ...registerVetDto,
      rol: Rol.VETERINARIO_PENDIENTE,
    });
  }
}
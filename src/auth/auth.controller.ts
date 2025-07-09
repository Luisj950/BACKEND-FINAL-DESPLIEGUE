// src/auth/auth.controller.ts

import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport'; // Es buena práctica usar el de @nestjs/passport
import { Request } from 'express';
import { RegisterVetDto } from './dto/register-vet.dto'; // <-- 1. IMPORTAR EL NUEVO DTO

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint para que un usuario inicie sesión.
   * Recibe email y password, y si son correctos, devuelve un JWT.
   */
  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint para registrar un nuevo usuario PROPIETARIO.
   * Recibe los datos del usuario, hashea la contraseña y lo guarda en la BD.
   */
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // --- 2. NUEVO ENDPOINT AÑADIDO ---
  /**
   * Endpoint para registrar un nuevo VETERINARIO.
   * La cuenta se creará con un rol 'pendiente de aprobación'.
   */
  @Post('register-vet')
  registerVet(@Body() registerVetDto: RegisterVetDto) {
    return this.authService.registerAsVet(registerVetDto);
  }
  // --- FIN DEL CÓDIGO AÑADIDO ---

  /**
   * Endpoint protegido para obtener el perfil del usuario autenticado.
   * Solo accesible si se envía un JWT válido en la cabecera de la petición.
   */
  @Get('profile')
  // Nota: Es más estándar usar AuthGuard('jwt') del paquete @nestjs/passport
  // si estás usando la estrategia JWT que configuramos.
  @UseGuards(AuthGuard('jwt')) 
  profile(@Req() req: Request) {
    // El AuthGuard ya hizo el trabajo de validar el token y adjuntar
    // la información del usuario (el 'payload' del token) a la petición.
    // Aquí, simplemente la devolvemos.
    return req.user; // <-- req.user es más estándar que req['user']
  }
}
// src/auth/auth.controller.ts

import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { RegisterVetDto } from './dto/register-vet.dto';
import { Public } from './decorators/public.decorator'; // ✅ 1. Se importa el decorador
import { GetUser } from './decorators/get-user.decorator'; // Es mejor usar GetUser que @Req
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // ✅ 2. Se marca como ruta PÚBLICA
  @Post('login')
  @HttpCode(HttpStatus.OK) // Devuelve un código 200 en lugar de 201
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @Public() // ✅ 3. Se marca como ruta PÚBLICA
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public() // ✅ 4. Se marca como ruta PÚBLICA
  @Post('register-vet')
  registerVet(@Body() registerVetDto: RegisterVetDto) {
    return this.authService.registerAsVet(registerVetDto);
  }

  /**
   * Endpoint protegido para obtener el perfil del usuario autenticado.
   * Ya no necesita @UseGuards porque el guard es global en main.ts
   */
  @Get('profile')
  profile(@GetUser() user: User) { // Se usa @GetUser para más seguridad y limpieza
    return user;
  }
}
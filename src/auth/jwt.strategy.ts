// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity'; // Asegúrate que esta ruta sea correcta

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'La clave secreta JWT_SECRET no está definida en el archivo .env. La aplicación no puede iniciar.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any): Promise<User> {
    console.log('--- PASO 1: JWT Strategy.validate() SE ESTÁ EJECUTANDO ---');
    console.log('Payload del token:', payload);

    if (!payload?.sub) {
      console.error('ERROR: El payload del token no tiene un ID (sub).');
      throw new UnauthorizedException('Token malformado.');
    }

    const user = await this.usersService.findOneByIdForAuth(payload.sub);

    console.log(
      'Usuario encontrado en la base de datos:',
      user ? { id: user.id, email: user.email } : null
    );

    if (!user) {
      console.error('ERROR: El usuario del token no fue encontrado en la base de datos.');
      throw new UnauthorizedException('El usuario ya no existe.');
    }

    console.log('--- PASO 1: TERMINADO. Devolviendo usuario válido. ---');

    return user; // ✅ Devuelve la entidad User completa
  }
}

// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// ✅ 1. CORRECCIÓN DE RUTAS: La ruta correcta desde 'src/auth/' es '../users/...'
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

// Define el tipo del payload del JWT para tener autocompletado.
interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // ✅ 2. CORRECCIÓN DE TIPO: Se verifica que la clave secreta exista.
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('La clave secreta JWT_SECRET no está definida en el archivo .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Se usa la variable 'secret' que ya sabemos que es un string.
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Se verifica que el usuario del token todavía exista en la base de datos.
    const user = await this.usersService.findOneByIdForAuth(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token inválido: el usuario ya no existe.');
    }
    
    // Lo que se retorna aquí se adjunta a request.user
    return { 
      sub: payload.sub, 
      email: payload.email, 
      rol: payload.rol 
    };
  }
}
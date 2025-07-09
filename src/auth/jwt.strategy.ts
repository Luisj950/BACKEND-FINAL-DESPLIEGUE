// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // Asegúrate de que la ruta sea correcta

// (Opcional pero recomendado) Define la forma del payload del token
interface JwtPayload {
  sub: string; // ID del usuario que viene en el token
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    // 1. VERIFICA que la clave secreta JWT exista en las variables de entorno
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Variable de entorno JWT_SECRET no encontrada');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Asegura que los tokens expirados sean rechazados
      secretOrKey: secret,
    });
  }

  /**
   * Este método se ejecuta en cada petición protegida después de que el token
   * ha sido verificado. Su propósito es validar el contenido del token
   * y devolver los datos del usuario que se adjuntarán a la request (`req.user`).
   */
  async validate(payload: JwtPayload) {
    // 1. Convierte el 'sub' (ID de usuario en el token) a un número
    const userId = parseInt(payload.sub, 10);

    // 2. Valida que el ID sea un número válido
    if (isNaN(userId)) {
      throw new UnauthorizedException('Token inválido: ID de usuario mal formado.');
    }

    // 3. Usa el método especial para buscar al usuario por ID, obteniendo la entidad completa
    const user = await this.usersService.findOneByIdForAuth(userId);

    // 4. Si el usuario con ese ID ya no existe en la base de datos, rechaza el token
    if (!user) {
      throw new UnauthorizedException('Token inválido o el usuario ya no existe.');
    }

    // 5. Quita la contraseña del objeto antes de devolverlo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    // 6. Devuelve el objeto 'result' (sin la contraseña).
    // Esto se convertirá en 'req.user' en tus controladores.
    return result;
  }
}
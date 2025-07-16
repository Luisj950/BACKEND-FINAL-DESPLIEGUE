import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Variable de entorno JWT_SECRET no encontrada');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = parseInt(payload.sub, 10);
    if (isNaN(userId)) {
      throw new UnauthorizedException('Token inválido: ID de usuario mal formado.');
    }

    // Se llama al método correcto
    const user = await this.usersService.findOneByIdForAuth(userId);

    if (!user) {
      throw new UnauthorizedException('Token inválido o el usuario ya no existe.');
    }

    const { password, ...result } = user;
    return result;
  }
}
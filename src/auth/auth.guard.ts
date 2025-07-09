import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Se requiere un token de autenticación');
    }

    try {
      // Verificamos el token usando el secreto de nuestro .env
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Si el token es válido, adjuntamos el payload a la petición.
      // Así, nuestras rutas protegidas pueden acceder a los datos del usuario.
      request['user'] = payload;
    } catch {
      // Si la verificación falla (token expirado, inválido, etc.), lanzamos un error.
      throw new UnauthorizedException('El token proporcionado no es válido');
    }
    
    // Si todo va bien, permitimos el acceso a la ruta.
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Rol } from '../enums/rol.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos para la ruta desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se especifican roles en el endpoint, permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtiene el objeto 'user' que fue adjuntado por JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // Comprueba si el rol del usuario está incluido en la lista de roles requeridos
    // user.rol viene directamente del objeto que devolviste en JwtStrategy.validate
    return requiredRoles.some((rol) => user.rol === rol);
  }
}
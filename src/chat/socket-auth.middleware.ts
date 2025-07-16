// src/chat/socket-auth.middleware.ts

import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

// Definimos un tipo para el payload del token para tener autocompletado
export interface AuthPayload {
  sub: number; // 'sub' es el estándar para el ID de usuario en JWT
  email: string;
  iat: number;
  exp: number;
}

// El middleware es una función que recibe el JwtService y devuelve otra función
export const SocketAuthMiddleware = (jwtService: JwtService) => {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      // Obtenemos el token que el cliente envió en socket.auth.token
      const token = client.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verificamos y decodificamos el token
      const payload: AuthPayload = jwtService.verify(token);

      // ¡ÉXITO! Añadimos el ID del usuario al objeto del handshake para usarlo después
      client.handshake.auth.userId = payload.sub;

      next(); // Continuamos con la conexión
    } catch (err) {
      // El token es inválido o ha expirado
      next(new Error('Authentication error: Invalid token'));
    }
  };
};
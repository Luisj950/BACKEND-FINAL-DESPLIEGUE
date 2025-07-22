// src/auth/decorators/public.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Este decorador simplemente añade una marca ("metadata") a una ruta.
// Nuestro guard personalizado (JwtAuthGuard) buscará esta marca
// para saber si debe ignorar la autenticación en esa ruta específica.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
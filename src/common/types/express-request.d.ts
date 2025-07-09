// src/types/express/index.d.ts

import { User } from '../../users/entities/user.entity'; // Ajusta la ruta a tu entidad User

// Declaración de módulo para fusionar interfaces de Express
declare global {
  namespace Express {
    interface Request {
      user?: User; // Define que la propiedad 'user' existe y es de tipo 'User'
    }
  }
}
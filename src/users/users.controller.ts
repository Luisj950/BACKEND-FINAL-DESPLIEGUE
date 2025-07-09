// src/users/users.controller.ts

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; // Usamos el guard de passport
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../auth/enums/rol.enum';

@Controller('users')
// Aplicamos los guardias a TODO el controlador.
// Cualquier ruta aquí dentro requerirá que el usuario esté autenticado.
// Luego, cada método puede especificar los roles que requiere.
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- Endpoint para que un ADMIN cree nuevos usuarios con roles ---
  // POST /users/create-by-admin
  @Post('create-by-admin')
  @Roles(Rol.ADMIN) // Solo el rol ADMIN puede acceder
  createByAdmin(@Body() createUserDto: CreateUserDto) {
    // Es buena idea tener un método de servicio separado para esto
    // que ya se encargue de hashear la contraseña.
    return this.usersService.create(createUserDto); 
  }

  // --- Endpoint para que un ADMIN vea todos los usuarios ---
  // GET /users
  @Get()
  @Roles(Rol.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // --- NUEVA RUTA: Para que el Admin vea la lista de Vets pendientes ---
  // GET /users/pending-vets
  @Get('pending-vets')
  @Roles(Rol.ADMIN)
  findPendingVets() {
    return this.usersService.findPendingVets();
  }

  // --- Endpoint para ver un usuario específico por ID ---
  // GET /users/:id
  // Por ahora, cualquier usuario autenticado puede ver a otro, podrías restringirlo.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // --- Endpoint para actualizar un usuario ---
  // PATCH /users/:id
  // Aquí también podrías añadir lógica de roles (ej: un admin o el propio usuario)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // --- NUEVA RUTA: Para que el Admin apruebe a un Vet ---
  // PATCH /users/:id/approve-vet
  @Patch(':id/approve-vet')
  @Roles(Rol.ADMIN)
  approveVeterinarian(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveVet(id);
  }

  // --- Endpoint para que un ADMIN elimine un usuario ---
  // DELETE /users/:id
  @Delete(':id')
  @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
// src/users/users.controller.ts

import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, ParseIntPipe, ForbiddenException,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../auth/enums/rol.enum';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-by-admin')
  @Roles(Rol.ADMIN)
  createByAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  @Roles(Rol.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('contacts')
  @Roles(Rol.ADMIN, Rol.PROPIETARIO, Rol.VETERINARIO)
  findAllContacts(@GetUser() user: User) {
    // ✅ CORRECCIÓN: Se usa user.id en lugar de user.sub
    return this.usersService.findAllContacts(user.id);
  }

  @Get('pending-vets')
  @Roles(Rol.ADMIN)
  findPendingVets() {
    return this.usersService.findPendingVets();
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.PROPIETARIO, Rol.VETERINARIO)
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: User) {
    const userToView = await this.usersService.findOne(id);
    if (userToView.rol === Rol.ADMIN && currentUser.rol !== Rol.ADMIN) {
        throw new ForbiddenException('No tienes permiso para ver este perfil.');
    }
    return userToView;
  }

  @Patch(':id')
  @Roles(Rol.ADMIN, Rol.PROPIETARIO, Rol.VETERINARIO)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User
  ) {
    // ✅ CORRECCIÓN: Se usa currentUser.id en lugar de currentUser.sub
    if (currentUser.rol !== Rol.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('No tienes permiso para actualizar este perfil.');
    }
    return this.usersService.update(id, updateUserDto);
  }
  
  @Patch(':id/approve-vet')
  @Roles(Rol.ADMIN)
  approveVeterinarian(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveVet(id);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
// src/mascotas/mascotas.controller.ts

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator'; // ✅ 1. Se importa el decorador GetUser

@Controller('mascotas')

export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() createMascotaDto: CreateMascotaDto, 
    @GetUser() user: User, // ✅ 2. Se usa @GetUser() para obtener el usuario de forma segura
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    // Ya no se necesita 'req.user', 'user' viene directamente del token.
    return this.mascotasService.create(createMascotaDto, user, files);
  }

  // Endpoint para que un usuario obtenga SUS PROPIAS mascotas.
  @Get('/mis-mascotas')
  findMisMascotas(@GetUser() user: User) { // ✅ 3. Se usa @GetUser() aquí también
    return this.mascotasService.findMascotasByPropietario(user.id);
  }

  // ✅ 4. ENDPOINT AÑADIDO: El que tu modal de agenda está buscando.
  // Permite obtener las mascotas de cualquier propietario por su ID.
  @Get('/propietario/:id')
  findMascotasDePropietario(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.findMascotasByPropietario(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMascotaDto: UpdateMascotaDto) {
    return this.mascotasService.update(id, updateMascotaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) { // ✅ 5. Se usa @GetUser() para la eliminación segura
    return this.mascotasService.remove(id, user.id);
  }
}
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
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('mascotas')
@UseGuards(AuthGuard()) // ✅ AÑADE ESTA LÍNEA AQUÍ
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() createMascotaDto: CreateMascotaDto, 
    @GetUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    return this.mascotasService.create(createMascotaDto, user, files);
  }

  @Get('/mis-mascotas')
  findMisMascotas(@GetUser() user: User) {
    return this.mascotasService.findMascotasByPropietario(user.id);
  }

  @Get('/propietario/:id')
  findMascotasDePropietario(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.findMascotasByPropietario(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mascotasService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5))
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMascotaDto: UpdateMascotaDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.mascotasService.update(id, updateMascotaDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.mascotasService.remove(id, user.id);
  }
}
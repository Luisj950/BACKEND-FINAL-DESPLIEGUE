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
  Req, 
  ParseIntPipe,
  UseInterceptors,     // ✅ 1. Se importa UseInterceptors
  UploadedFiles        // ✅ 2. Se importa UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; // ✅ 3. Se importa el interceptor de archivos
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Controller('mascotas')
@UseGuards(AuthGuard('jwt'))
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  // ✅ 4. Se usa el interceptor para capturar los archivos del campo 'files'
  @UseInterceptors(FilesInterceptor('files', 5)) // Acepta hasta 5 archivos
  create(
    @Body() createMascotaDto: CreateMascotaDto, 
    @Req() req: Request,
    // ✅ 5. Se reciben los archivos en el método
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    const user = req.user as User;
    // ✅ 6. Se envían los datos y los archivos al servicio
    return this.mascotasService.create(createMascotaDto, user, files);
  }

  @Get('/mis-mascotas')
  findMisMascotas(@Req() req: Request) {
    const user = req.user as User;
    return this.mascotasService.findMascotasByPropietario(user.id);
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
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.mascotasService.remove(id, user.id);
  }
}
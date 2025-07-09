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
  UnauthorizedException,
  ParseIntPipe 
} from '@nestjs/common';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../users/entities/user.entity'; // O la ruta correcta a tu entidad

@Controller('mascotas')
@UseGuards(AuthGuard('jwt')) // Protege todas las rutas del controlador
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  create(@Body() createMotaDto: CreateMascotaDto, @Req() req: Request) {
    const user = req.user as User;
    return this.mascotasService.create(createMotaDto, user);
  }

  @Get('/mis-mascotas')
  findMisMascotas(@Req() req: Request) {
    const user = req.user as User;
    return this.mascotasService.findMascotasByPropietario(user.id);
  }

  // --- MÉTODOS QUE FALTABAN ---

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
    // Pasa el ID del usuario para verificar que es el dueño
    return this.mascotasService.remove(id, user.id);
  }
}
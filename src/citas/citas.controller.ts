// src/citas/citas.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('citas')
@UseGuards(AuthGuard('jwt')) // 🛡️ Protege todas las rutas de este controlador
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  /**
   * Endpoint para crear una nueva cita.
   * POST /citas
   */
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  /**
   * Endpoint para obtener la agenda de un veterinario específico.
   * GET /citas/veterinario/:id
   */
  @Get('veterinario/:id')
  findAllByVeterinario(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.findAllByVeterinario(id);
  }

  /**
   * Endpoint para cancelar una cita.
   * PATCH /citas/:id/cancelar
   */
  @Patch(':id/cancelar')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User, // Obtiene el usuario autenticado que realiza la acción
  ) {
    return this.citasService.cancel(id, user);
  }
}
// src/historias-clinicas/historias-clinicas.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { CreateAtencionMedicaDto } from './dto/create-atencion-medica.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../auth/enums/rol.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('historias-clinicas')
@UseGuards(RolesGuard)
export class HistoriasClinicasController {
  constructor(
    private readonly historiasClinicasService: HistoriasClinicasService,
  ) {}

  @Post('atencion/:id') // Se estandariza a ':id'
  @Roles(Rol.VETERINARIO, Rol.ADMIN)
  createAtencion(
    @Param('id', ParseIntPipe) mascotaId: number, // Se recibe el ':id' como mascotaId
    @Body() createDto: CreateAtencionMedicaDto,
    @GetUser() veterinario: User,
  ) {
    return this.historiasClinicasService.createAtencion(
      mascotaId,
      createDto,
      veterinario,
    );
  }

  // ✅ CAMBIO IMPLEMENTADO: Se estandariza el parámetro a ':id'
  @Get('mascota/:id')
  @Roles(Rol.VETERINARIO, Rol.ADMIN, Rol.PROPIETARIO)
  findHistoriaByMascotaId(@Param('id', ParseIntPipe) id: number) { // Se recibe y usa ':id'
    return this.historiasClinicasService.findHistoriaByMascotaId(id);
  }

  @Get('search')
  @Roles(Rol.VETERINARIO, Rol.ADMIN)
  search(
    @Query('termino') termino?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.historiasClinicasService.searchRepositorio(termino, categoria);
  }
}


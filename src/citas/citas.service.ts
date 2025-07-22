// src/citas/citas.service.ts

import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cita, EstadoCita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citasRepository: Repository<Cita>,
  ) {}

  /**
   * Crea una nueva cita, validando que el horario del veterinario esté libre.
   */
  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const { fechaHoraInicio, duracionMinutos, veterinarioId, mascotaId } = createCitaDto;

    // Calcula la hora de finalización de la cita
    const fechaInicio = new Date(fechaHoraInicio);
    const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);

    // 🚨 LÓGICA CLAVE: Buscar si el veterinario ya tiene una cita que se cruce en ese horario.
    // Se busca cualquier cita que empiece o termine dentro del nuevo horario solicitado.
    const citaSuperpuesta = await this.citasRepository.findOne({
      where: [
        // Opción 1: Una cita existente empieza DURANTE la nueva cita.
        {
          veterinario: { id: veterinarioId },
          estado: EstadoCita.PROGRAMADA,
          fechaHoraInicio: Between(fechaInicio, fechaFin),
        },
        // Opción 2: Una cita existente termina DURANTE la nueva cita.
        {
          veterinario: { id: veterinarioId },
          estado: EstadoCita.PROGRAMADA,
          fechaHoraFin: Between(fechaInicio, fechaFin),
        },
      ],
    });

    // Si se encuentra una cita, significa que el horario está ocupado.
    if (citaSuperpuesta) {
      throw new ConflictException(
        'El veterinario ya tiene una cita programada en este horario. Por favor, elige otro momento.',
      );
    }

    // Si el horario está libre, creamos la nueva cita.
    const nuevaCita = this.citasRepository.create({
      ...createCitaDto,
      fechaHoraInicio: fechaInicio,
      fechaHoraFin: fechaFin,
      mascota: { id: mascotaId },
      veterinario: { id: veterinarioId },
    });

    return this.citasRepository.save(nuevaCita);
  }

  /**
   * Obtiene todas las citas programadas para un veterinario específico.
   */
  async findAllByVeterinario(veterinarioId: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: {
        veterinario: { id: veterinarioId },
        estado: EstadoCita.PROGRAMADA, // Solo muestra las que están activas
      },
      order: { fechaHoraInicio: 'ASC' }, // Las ordena por fecha
    });
  }

  /**
   * Cancela una cita.
   */
  async cancel(citaId: number, usuarioQueCancela: User): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
        where: { id: citaId },
        relations: ['mascota', 'veterinario']
    });

    if (!cita) {
      throw new NotFoundException(`La cita con ID ${citaId} no fue encontrada.`);
    }

    // Protocolo de cancelación: Define quién puede cancelar y bajo qué rol.
    let estadoCancelacion: EstadoCita;
    if (usuarioQueCancela.rol === 'veterinario') {
      if (cita.veterinario.id !== usuarioQueCancela.id) {
        throw new ForbiddenException('No tienes permiso para cancelar esta cita.');
      }
      estadoCancelacion = EstadoCita.CANCELADA_VET;
    } else { // Asumimos que es un propietario
      // Aquí necesitarías cargar la relación completa de mascota.propietario
      // const mascota = await this.mascotasRepository.findOne...
      // if(mascota.propietario.id !== usuarioQueCancela.id) ...
      estadoCancelacion = EstadoCita.CANCELADA_PACIENTE;
    }

    cita.estado = estadoCancelacion;
    return this.citasRepository.save(cita);
  }
}
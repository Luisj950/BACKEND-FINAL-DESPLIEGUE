// src/historias-clinicas/historias-clinicas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { AtencionMedica } from './entities/atencion-medica.entity';
import { CreateAtencionMedicaDto } from './dto/create-atencion-medica.dto';
import { User } from '../users/entities/user.entity';
import { Mascota } from '../mascotas/entities/mascota.entity';

@Injectable()
export class HistoriasClinicasService { // ✅ La palabra 'export' es la clave
  constructor(
    @InjectRepository(HistoriaClinica)
    private readonly historiaClinicaRepository: Repository<HistoriaClinica>,
    @InjectRepository(AtencionMedica)
    private readonly atencionMedicaRepository: Repository<AtencionMedica>,
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async createAtencion(
    mascotaId: number,
    createDto: CreateAtencionMedicaDto,
    veterinario: User,
  ): Promise<AtencionMedica> {
    
    let historia = await this.historiaClinicaRepository.findOne({
      where: { mascota: { id: mascotaId } },
    });

    if (!historia) {
      const mascota = await this.mascotaRepository.findOneBy({ id: mascotaId });
      if (!mascota) {
        throw new NotFoundException(`No se encontró la mascota con ID ${mascotaId}`);
      }
      historia = this.historiaClinicaRepository.create({ mascota });
      await this.historiaClinicaRepository.save(historia);
    }

    const nuevaAtencion = this.atencionMedicaRepository.create({
      ...createDto,
      historiaClinica: historia,
      veterinario: veterinario,
    });

    return this.atencionMedicaRepository.save(nuevaAtencion);
  }

  async findHistoriaByMascotaId(mascotaId: number): Promise<HistoriaClinica> {
    const historia = await this.historiaClinicaRepository.findOne({
      where: { mascota: { id: mascotaId } },
      order: {
        atenciones: {
          fechaAtencion: 'DESC',
        },
      },
    });

    if (!historia) {
      throw new NotFoundException(
        `No se encontró historia clínica para la mascota con ID ${mascotaId}`,
      );
    }
    return historia;
  }

  async searchRepositorio(termino?: string, categoria?: string) {
    const options: FindManyOptions<AtencionMedica> = {
      relations: ['historiaClinica', 'historiaClinica.mascota'],
      order: { fechaAtencion: 'DESC' },
    };

    if (termino) {
      options.where = [
        { diagnostico: ILike(`%${termino}%`) },
        { tratamiento: ILike(`%${termino}%`) },
        { anamnesis: ILike(`%${termino}%`) },
      ];
    }

    const atenciones = await this.atencionMedicaRepository.find(options);

    return atenciones.map(atencion => ({
      id: atencion.id,
      fechaAtencion: atencion.fechaAtencion,
      categoria: atencion.categoria,
      anamnesis: atencion.anamnesis,
      diagnostico: atencion.diagnostico,
      tratamiento: atencion.tratamiento,
      observaciones: atencion.observaciones,
      mascota: {
        especie: atencion.historiaClinica.mascota.especie,
        raza: atencion.historiaClinica.mascota.raza,
        sexo: atencion.historiaClinica.mascota.sexo,
      },
    }));
  }
}
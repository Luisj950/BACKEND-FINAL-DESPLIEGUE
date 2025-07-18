// src/mascotas/mascotas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from '../mascotas/entities/mascota.entity'; // Corregí la ruta
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  // ✅ 1. El método create ahora acepta los archivos
  async create(createMascotaDto: CreateMascotaDto, propietario: User, files: Array<Express.Multer.File>): Promise<Mascota> {
    
    // ✅ 2. Lógica para procesar las imágenes
    // En un caso real, aquí subirías cada archivo a un servicio como Cloudinary y obtendrías las URLs.
    // Por ahora, simularemos las URLs a partir del nombre del archivo.
    const urlsDeImagenes = files ? files.map(file => `/uploads/${file.filename}`) : [];

    const nuevaMascota = this.mascotaRepository.create({
      ...createMascotaDto,
      propietario: propietario,
      imagenUrls: urlsDeImagenes, // ✅ 3. Se asigna el array de URLs
    });

    return this.mascotaRepository.save(nuevaMascota);
  }

  async findMascotasByPropietario(propietarioId: number): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      where: {
        propietario: { id: propietarioId },
      },
      select: ['id', 'nombre', 'especie', 'raza', 'imagenUrls'], // Aseguramos enviar las URLs
    });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({ 
      where: { id },
      // ✅ MEJORA: Cargamos las relaciones para la página de detalles
      relations: ['historiaClinica', 'historiaClinica.atenciones'] 
    });

    if (!mascota) {
      throw new NotFoundException(`Mascota con id #${id} no encontrada`);
    }
    return mascota;
  }

  async update(id: number, updateMascotaDto: UpdateMascotaDto): Promise<Mascota> {
    const mascota = await this.mascotaRepository.preload({
      id: id,
      ...updateMascotaDto,
    });
    if (!mascota) {
      throw new NotFoundException(`La mascota con el ID #${id} no fue encontrada.`);
    }
    return this.mascotaRepository.save(mascota);
  }

  async remove(id: number, propietarioId: number): Promise<void> {
    const mascota = await this.mascotaRepository.findOne({ 
      where: { id, propietario: { id: propietarioId } } 
    });
    if (!mascota) {
      throw new NotFoundException(`La mascota con el ID #${id} no fue encontrada o no te pertenece.`);
    }
    await this.mascotaRepository.delete(id);
  }
}
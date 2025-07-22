// src/mascotas/mascotas.service.ts

import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException, // Se añade para manejar errores inesperados
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  // ✅ MÉTODO CREATE REESCRITO PARA SER MÁS SEGURO
  async create(createMascotaDto: CreateMascotaDto, propietario: User, files: Array<Express.Multer.File>): Promise<Mascota> {
    
    // 1. Verificación de seguridad: Asegurarse de que el objeto propietario no es nulo.
    if (!propietario || !propietario.id) {
      console.error('ERROR CRÍTICO: El objeto "propietario" llegó nulo o sin ID al servicio.');
      throw new InternalServerErrorException('No se pudo identificar al usuario para crear la mascota.');
    }

    const urlsDeImagenes = files ? files.map(file => `/uploads/${file.filename}`) : [];

    // 2. Creación explícita del objeto para evitar problemas con el spread operator (...)
    // Se construye el objeto manualmente para garantizar que 'propietario' se asigne correctamente.
    const nuevaMascota = this.mascotaRepository.create({
      nombre: createMascotaDto.nombre,
      especie: createMascotaDto.especie,
      raza: createMascotaDto.raza,
      fechaNacimiento: createMascotaDto.fechaNacimiento,
      sexo: createMascotaDto.sexo,
      color: createMascotaDto.color,
      imagenUrls: urlsDeImagenes,
      propietario: propietario, // Asignación directa del objeto User completo
    });

    try {
      return await this.mascotaRepository.save(nuevaMascota);
    } catch (error) {
      // Si aún falla, el log nos dará la pista final.
      console.error('Error al guardar la mascota:', error);
      throw new InternalServerErrorException('Ocurrió un error al guardar la mascota en la base de datos.');
    }
  }

  async findMascotasByPropietario(propietarioId: number): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      where: {
        propietario: { id: propietarioId },
      },
      select: ['id', 'nombre', 'especie', 'raza', 'imagenUrls'],
    });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({ 
      where: { id },
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
// src/mascotas/mascotas.service.ts

import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException,
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

  // ... (tu método create y otros métodos se mantienen igual)
  async create(createMascotaDto: CreateMascotaDto, propietario: User, files: Array<Express.Multer.File>): Promise<Mascota> {
    if (!propietario || !propietario.id) {
      console.error('ERROR CRÍTICO: El objeto "propietario" llegó nulo o sin ID al servicio.');
      throw new InternalServerErrorException('No se pudo identificar al usuario para crear la mascota.');
    }
    const urlsDeImagenes = files ? files.map(file => `/uploads/${file.filename}`) : [];
    const nuevaMascota = this.mascotaRepository.create({
      ...createMascotaDto,
      imagenUrls: urlsDeImagenes,
      propietario: propietario,
    });
    try {
      return await this.mascotaRepository.save(nuevaMascota);
    } catch (error) {
      console.error('Error al guardar la mascota:', error);
      throw new InternalServerErrorException('Ocurrió un error al guardar la mascota en la base de datos.');
    }
  }

  async findMascotasByPropietario(propietarioId: number): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      where: { propietario: { id: propietarioId } },
      select: ['id', 'nombre', 'especie', 'raza', 'imagenUrls'],
    });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({ 
      where: { id },
      relations: ['propietario', 'historiaClinica', 'historiaClinica.atenciones', 'historiaClinica.atenciones.veterinario'] 
    });
    if (!mascota) {
      throw new NotFoundException(`Mascota con id #${id} no encontrada`);
    }
    return mascota;
  }

  // ✅ --- FUNCIÓN UPDATE CON REGISTROS DE DEPURACIÓN ---
  async update(id: number, updateMascotaDto: UpdateMascotaDto, files: Array<Express.Multer.File>): Promise<Mascota> {
    
    console.log('--- INICIANDO PROCESO DE ACTUALIZACIÓN DE MASCOTA ---');
    console.log(`Buscando mascota con ID: ${id}`);
    console.log('Datos recibidos en el DTO:', updateMascotaDto);
    console.log(`Número de archivos recibidos: ${files ? files.length : 0}`);

    // 1. Cargamos la mascota existente con sus datos actuales
    const mascota = await this.mascotaRepository.preload({
      id: id,
      ...updateMascotaDto,
    });

    if (!mascota) {
      console.error(`ERROR: No se encontró la mascota con ID #${id} para precargar.`);
      throw new NotFoundException(`La mascota con el ID #${id} no fue encontrada.`);
    }
    
    console.log('Mascota encontrada y precargada con los nuevos datos de texto.');

    // 2. Si se subieron nuevos archivos, los procesamos
    if (files && files.length > 0) {
      const urlsDeImagenes = files.map(file => `/uploads/${file.filename}`);
      console.log('Nuevas URLs de imagen generadas:', urlsDeImagenes);
      mascota.imagenUrls = urlsDeImagenes;
    } else {
      console.log('No se subieron nuevas imágenes, se mantienen las existentes.');
    }

    // 3. Guardamos la mascota
    try {
      console.log('Intentando guardar la mascota actualizada en la base de datos...');
      const mascotaGuardada = await this.mascotaRepository.save(mascota);
      console.log('--- ACTUALIZACIÓN COMPLETADA CON ÉXITO ---');
      return mascotaGuardada;
    } catch (error) {
      console.error('--- ERROR DURANTE EL GUARDADO EN LA BASE DE DATOS ---');
      console.error(error); // Mostramos el error completo de la base de datos
      throw new InternalServerErrorException('Ocurrió un error al actualizar la mascota.');
    }
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
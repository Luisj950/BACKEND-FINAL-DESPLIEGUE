import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from '../users/entities/mascota.entity'; // Asumiendo la ruta centralizada
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { User } from '../users/entities/user.entity'; // Asumiendo la ruta centralizada

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto, propietario: User): Promise<Mascota> {
    const nuevaMascota = this.mascotaRepository.create({
      ...createMascotaDto,
      propietario: propietario,
    });
    return this.mascotaRepository.save(nuevaMascota);
  }

  async findMascotasByPropietario(propietarioId: number): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      where: {
        propietario: { id: propietarioId },
      },
    });
  }

  async findOne(id: number): Promise<Mascota> {
    console.log(`--- Buscando mascota con ID: ${id} (Tipo: ${typeof id}) ---`);
    const mascota = await this.mascotaRepository.findOne({ where: { id } });
    console.log('--- Resultado de la búsqueda en la base de datos:', mascota, '---');

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
    
    const result = await this.mascotaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`La mascota con el ID #${id} no fue encontrada.`);
    }
  }
}
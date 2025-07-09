// src/mascotas/entities/mascota.entity.ts

import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'mascotas' })
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  especie: string; // ej: 'Perro', 'Gato'

  @Column()
  raza: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // --- RELACIÓN ---
  // Muchas mascotas pueden pertenecer a un usuario (propietario)
  @ManyToOne(() => User, (user) => user.mascotas, { nullable: false })
  propietario: User;
}
// src/citas/entities/cita.entity.ts

import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Mascota } from '../entities/mascota.entity';

@Entity({ name: 'citas' })
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column()
  motivo: string;

  @Column({ default: 'programada' }) // ej: 'programada', 'completada', 'cancelada'
  estado: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // --- RELACIONES ---

  // Muchas citas pueden ser asignadas a un veterinario (User)
  @ManyToOne(() => User, (user) => user.citasAsignadas, { nullable: false })
  veterinario: User;

  // Muchas citas pueden corresponder a una mascota
  @ManyToOne(() => Mascota, { nullable: false }) // Asumimos que no hay relación inversa en Mascota para simplificar
  mascota: Mascota;
}
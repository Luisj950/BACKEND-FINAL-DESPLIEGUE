// src/citas/entities/cita.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Mascota } from '../../mascotas/entities/mascota.entity';

// Enum para los tipos de cita, para estandarizar las opciones.
export enum TipoCita {
  CONSULTA_GENERAL = 'consulta_general',
  CIRUGIA = 'cirugia',
  VACUNACION = 'vacunacion',
  SEGUIMIENTO = 'seguimiento',
  URGENCIA = 'urgencia',
}

// Enum para el estado de la cita.
export enum EstadoCita {
  PROGRAMADA = 'programada',
  COMPLETADA = 'completada',
  CANCELADA_VET = 'cancelada_por_veterinario',
  CANCELADA_PACIENTE = 'cancelada_por_paciente',
}

@Entity({ name: 'citas' })
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Fecha y hora de inicio de la cita' })
  fechaHoraInicio: Date;

  @Column({ comment: 'Fecha y hora de finalización de la cita' })
  fechaHoraFin: Date;

  @Column({
    type: 'enum',
    enum: TipoCita,
    default: TipoCita.CONSULTA_GENERAL,
    comment: 'El tipo de servicio que se prestará en la cita',
  })
  tipo: TipoCita;

  @Column({
    type: 'enum',
    enum: EstadoCita,
    default: EstadoCita.PROGRAMADA,
    comment: 'El estado actual de la cita',
  })
  estado: EstadoCita;

  @Column({ type: 'text', nullable: true, comment: 'Notas adicionales del propietario o veterinario' })
  notas: string;

  // --- Relaciones Fundamentales ---

  // Relación con la Mascota (Paciente)
  @ManyToOne(() => Mascota, (mascota) => mascota.citas, {
    onDelete: 'CASCADE', // Si se elimina la mascota, se eliminan sus citas.
    eager: true, // Carga automáticamente la info de la mascota al buscar una cita.
  })
  mascota: Mascota;

  // Relación con el User (Veterinario)
  @ManyToOne(() => User, (user) => user.citasAsignadas, {
    onDelete: 'SET NULL', // Si se elimina el vet, la cita no se elimina, solo se quita la asignación.
    eager: true, // Carga automáticamente la info del veterinario.
  })
  veterinario: User;

  // --- Timestamps Automáticos ---
  
  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
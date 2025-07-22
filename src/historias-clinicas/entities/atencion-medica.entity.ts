// src/historias-clinicas/entities/atencion-medica.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HistoriaClinica } from './historia-clinica.entity';
import { User } from '../../users/entities/user.entity';

// Enum para estandarizar las categorías de atención
export enum CategoriaAtencion {
  CONSULTA = 'Consulta',
  CIRUGIA = 'Cirugía',
  VACUNACION = 'Vacunación',
  DESPARASITACION = 'Desparasitación',
  EXAMEN_LABORATORIO = 'Examen de Laboratorio',
  IMAGENOLOGIA = 'Imagenología', // Rayos X, Ecografías, etc.
  URGENCIA = 'Urgencia',
}

@Entity({ name: 'atenciones_medicas' })
export class AtencionMedica {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fechaAtencion: Date;

  @Column({
    type: 'enum',
    enum: CategoriaAtencion,
    default: CategoriaAtencion.CONSULTA,
    comment: 'Clasificación principal del tipo de atención',
  })
  categoria: CategoriaAtencion;

  @Column('text', { comment: 'Descripción de los síntomas o motivo de la consulta' })
  anamnesis: string;

  @Column('text', { comment: 'Diagnóstico del veterinario' })
  diagnostico: string;

  @Column('text', { comment: 'Tratamiento prescrito o aplicado' })
  tratamiento: string;

  @Column('text', { nullable: true, comment: 'Notas adicionales, observaciones o indicaciones' })
  observaciones?: string;

  // --- Relaciones ---

  @ManyToOne(() => HistoriaClinica, (historia) => historia.atenciones, {
    onDelete: 'CASCADE', // Si se borra la historia, se borra esta atención
  })
  historiaClinica: HistoriaClinica;

  @ManyToOne(() => User, {
    nullable: false, // Una atención siempre debe tener un veterinario
    eager: true, // Carga los datos del veterinario automáticamente
  })
  veterinario: User;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
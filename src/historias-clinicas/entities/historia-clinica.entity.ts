// src/historias-clinicas/entities/historia-clinica.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { AtencionMedica } from './atencion-medica.entity';

@Entity({ name: 'historias_clinicas' })
export class HistoriaClinica {
  @PrimaryGeneratedColumn()
  id: number;

  // --- Relaciones Fundamentales ---

  // Una historia clínica pertenece a UNA SOLA mascota.
  @OneToOne(() => Mascota, (mascota) => mascota.historiaClinica, {
    onDelete: 'CASCADE', // Si se borra la mascota, se borra su historia.
  })
  @JoinColumn() // Esto crea la columna `mascotaId` en esta tabla.
  mascota: Mascota;

  // Una historia clínica puede tener MUCHAS atenciones médicas.
  @OneToMany(() => AtencionMedica, (atencion) => atencion.historiaClinica, {
    cascade: true, // Permite guardar/actualizar atenciones junto con la historia.
    eager: true,   // Carga automáticamente todas las atenciones al buscar una historia.
  })
  atenciones: AtencionMedica[];

  // --- Timestamps Automáticos ---

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
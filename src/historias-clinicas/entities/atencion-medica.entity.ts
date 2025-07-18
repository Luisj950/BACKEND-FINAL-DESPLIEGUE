// src/historias-clinicas/entities/atencion-medica.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { HistoriaClinica } from './historia-clinica.entity';

@Entity({ name: 'atenciones_medicas' })
export class AtencionMedica {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column('text')
  motivoConsulta: string;

  @Column('text')
  diagnostico: string;

  @Column('text', { nullable: true })
  tratamientoPrescrito: string;

  // Muchas atenciones médicas pertenecen a una sola historia clínica
  @ManyToOne(() => HistoriaClinica, historia => historia.atenciones)
  historiaClinica: HistoriaClinica;
}
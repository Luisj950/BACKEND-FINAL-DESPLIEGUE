// src/mascotas/entities/mascota.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HistoriaClinica } from '../../historias-clinicas/entities/historia-clinica.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { MonitoreoAlerta } from '../../monitoreo/entities/monitoreo-alerta.entity';
import { SexoMascota } from '../enums/sexo.enum';

@Entity({ name: 'mascotas' })
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  especie: string;

  @Column()
  raza: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ type: 'enum', enum: SexoMascota, nullable: true })
  sexo: SexoMascota;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'simple-array', nullable: true })
  imagenUrls: string[];

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
  
  // --- RELACIONES ---
  
  @ManyToOne(() => User, (user) => user.mascotas, { nullable: false })
  propietario: User;

  @OneToOne(() => HistoriaClinica, historia => historia.mascota)
  historiaClinica: HistoriaClinica;

  @OneToMany(() => Cita, (cita) => cita.mascota)
  citas: Cita[];

  @OneToMany(() => MonitoreoAlerta, (alerta) => alerta.mascota)
  alertas: MonitoreoAlerta[];
}
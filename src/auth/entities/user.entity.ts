// src/users/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Rol } from '../../auth/enums/rol.enum'; // <-- ¡ESTA ES LA LÍNEA CORREGIDA Y MÁS IMPORTANTE!
import { Mascota } from '../entities/mascota.entity'; // <-- Corregí esta ruta también por si acaso
import { ClinicaVeterinaria } from '../entities/clinica.entity'; // <-- Corregí esta ruta también
import { Cita } from '../entities/cita.entity'; // <-- Corregí esta ruta también

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ 
    type: 'enum', 
    enum: Rol, 
    default: Rol.PROPIETARIO 
  })
  rol: Rol;

  @Column({ nullable: true })
  especialidad: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // --- RELACIONES ---

  @OneToMany(() => Mascota, (mascota) => mascota.propietario)
  mascotas: Mascota[];

  @ManyToOne(() => ClinicaVeterinaria, (clinica) => clinica.veterinarios, { nullable: true })
  clinica: ClinicaVeterinaria;

  @OneToMany(() => Cita, (cita) => cita.veterinario)
  citasAsignadas: Cita[];
}
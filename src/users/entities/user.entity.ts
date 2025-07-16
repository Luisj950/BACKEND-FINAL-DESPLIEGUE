// src/users/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from '../enums/rol.enum';
import { Mascota } from './mascota.entity';
import { ClinicaVeterinaria } from './clinica.entity';
import { Cita } from './cita.entity';
import { MensajeChat } from '../../chat/entities/mensaje-chat.entity';

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

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.PROPIETARIO,
  })
  rol: Rol;

  @Column({ nullable: true })
  especialidad: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // --- Relaciones ---

  @OneToMany(() => Mascota, (mascota) => mascota.propietario)
  mascotas: Mascota[];

  @ManyToOne(() => ClinicaVeterinaria, (clinica) => clinica.veterinarios, { nullable: true })
  clinica: ClinicaVeterinaria;

  @OneToMany(() => Cita, (cita) => cita.veterinario)
  citasAsignadas: Cita[];

  // --- Relaciones de Chat ---

  @OneToMany(() => MensajeChat, (mensaje) => mensaje.emisor)
  mensajesEnviados: MensajeChat[];

  // --- ✅ CAMBIO AQUÍ ---
  // Se añade la relación que faltaba para los mensajes recibidos.
  @OneToMany(() => MensajeChat, (mensaje) => mensaje.destinatario)
  mensajesRecibidos: MensajeChat[];
}
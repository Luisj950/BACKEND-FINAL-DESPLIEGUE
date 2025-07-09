// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'; // <-- Asegúrate de importar UpdateDateColumn
import { Rol } from '../enums/rol.enum';
import { Mascota } from '../entities/mascota.entity';
import { ClinicaVeterinaria } from '../entities/clinica.entity';
import { Cita } from '../entities/cita.entity';

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

  @Column({ type: 'enum', enum: Rol, default: Rol.PROPIETARIO })
  rol: Rol;

  @Column({ nullable: true })
  especialidad: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn() // <-- ¡ESTA ES LA LÍNEA CRUCIAL QUE DEBE ESTAR AHÍ!
  fechaActualizacion: Date; // Puedes nombrar la columna como quieras, e.g., 'updatedAt'

  // --- RELACIONES ---

  @OneToMany(() => Mascota, (mascota) => mascota.propietario)
  mascotas: Mascota[];

  @ManyToOne(() => ClinicaVeterinaria, (clinica) => clinica.veterinarios, { nullable: true })
  clinica: ClinicaVeterinaria;

  @OneToMany(() => Cita, (cita) => cita.veterinario)
  citasAsignadas: Cita[];
}
// src/clinicas/entities/clinica.entity.ts

import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'clinicas' })
export class ClinicaVeterinaria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column()
  direccion: string;

  @Column({ nullable: true })
  telefono: string;
  
  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // --- RELACIÓN ---
  // Una clínica puede tener muchos usuarios (veterinarios)
  @OneToMany(() => User, (user) => user.clinica)
  veterinarios: User[];
}
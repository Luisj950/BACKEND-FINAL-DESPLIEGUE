import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'clinicas_veterinarias' })
export class ClinicaVeterinaria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  // --- RELACIONES ---
  @OneToMany(() => User, (user) => user.clinica)
  veterinarios: User[];
}
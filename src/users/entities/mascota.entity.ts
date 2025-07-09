import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HistoriaClinica } from './historia-clinica.entity';
import { Cita } from './cita.entity';
import { MonitoreoAlerta } from './monitoreo-alerta.entity';

@Entity({ name: 'mascotas' })
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  especie: string;

  @Column({ nullable: true })
  raza: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ length: 1, nullable: true })
  sexo: string; 

  @Column({ nullable: true })
  color: string;
  
  // --- RELACIONES ---
  @ManyToOne(() => User, (user) => user.mascotas)
  propietario: User;

  @OneToOne(() => HistoriaClinica, (historia) => historia.mascota)
  historiaClinica: HistoriaClinica;

  @OneToMany(() => Cita, (cita) => cita.mascota)
  citas: Cita[];

  @OneToMany(() => MonitoreoAlerta, (alerta) => alerta.mascota)
  alertas: MonitoreoAlerta[];
}
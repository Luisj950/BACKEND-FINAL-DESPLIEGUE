import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'; // <-- Añadimos OneToMany
import { HistoriaClinica } from './historia-clinica.entity';
import { User } from '../../users/entities/user.entity';
import { Tratamiento } from '../entities/tratamiento.entity'; // <-- Importamos Tratamiento

@Entity({ name: 'detalles_historia_clinica' })
export class DetalleHistoriaClinica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaConsulta: Date;

  @Column({ nullable: true })
  tipoConsulta: string;

  @Column('text', { nullable: true })
  diagnostico: string;

  // El campo 'tratamiento' de texto lo quitamos para usar la tabla relacionada, que es más estructurado.
  // @Column('text', { nullable: true })
  // tratamiento: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso: number;

  // --- RELACIONES ---
  @ManyToOne(() => HistoriaClinica, (historia) => historia.detalles)
  historiaClinica: HistoriaClinica;

  @ManyToOne(() => User) 
  veterinario: User;

  // --- NUEVA RELACIÓN AÑADIDA ---
  // Una entrada de consulta puede tener múltiples tratamientos asociados.
  @OneToMany(() => Tratamiento, (tratamiento) => tratamiento.detalleHistoriaClinica)
  tratamientos: Tratamiento[];
}
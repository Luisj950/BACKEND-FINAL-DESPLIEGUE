import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { DetalleHistoriaClinica } from './detalle-historia-clinica.entity';

@Entity({ name: 'repositorio_clinico_anonimizado' })
export class RepositorioClinicoAnonimizado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  especie: string;

  @Column()
  raza: string;

  @Column()
  edadAproximada: number;

  @Column({ length: 1 })
  sexo: string;

  @Column('text')
  diagnostico: string;

  @Column('text')
  tratamiento: string;

  @Column('text', { nullable: true })
  respuestaTratamiento: string;

  @Column({ nullable: true })
  palabrasClave: string;

  // --- RELACIONES ---
  // Cada caso anonimizado corresponde a un detalle de historia clínica
  @OneToOne(() => DetalleHistoriaClinica)
  @JoinColumn()
  detalleOriginal: DetalleHistoriaClinica;
}
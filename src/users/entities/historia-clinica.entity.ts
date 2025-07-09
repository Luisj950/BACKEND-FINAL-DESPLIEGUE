import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Mascota } from './mascota.entity';
import { DetalleHistoriaClinica } from './detalle-historia-clinica.entity';

@Entity({ name: 'historias_clinicas' })
export class HistoriaClinica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;
  
  // --- RELACIONES ---
  @OneToOne(() => Mascota, (mascota) => mascota.historiaClinica)
  @JoinColumn() // JoinColumn indica que esta es la entidad "dueña" de la relación
  mascota: Mascota;

  @OneToMany(() => DetalleHistoriaClinica, (detalle) => detalle.historiaClinica)
  detalles: DetalleHistoriaClinica[];
}
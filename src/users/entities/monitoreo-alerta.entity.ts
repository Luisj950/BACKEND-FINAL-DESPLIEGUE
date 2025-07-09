import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mascota } from './mascota.entity';

// Enum para los estados de una alerta
export enum EstadoAlerta {
    PENDIENTE = 'Pendiente',
    ENVIADA = 'Enviada',
    CONFIRMADA = 'Confirmada',
}

@Entity({ name: 'monitoreo_alertas' })
export class MonitoreoAlerta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoAlerta: string; // Ej: 'Recordatorio Medicamento', 'Recordatorio Cita'

  @Column('text')
  mensaje: string;

  @Column({ type: 'timestamp' })
  fechaProgramada: Date;

  @Column({
      type: 'enum',
      enum: EstadoAlerta,
      default: EstadoAlerta.PENDIENTE,
  })
  estado: EstadoAlerta;
  
  // --- RELACIONES ---

  // Muchas alertas pertenecen a una Mascota
  @ManyToOne(() => Mascota, (mascota) => mascota.alertas)
  mascota: Mascota;
}
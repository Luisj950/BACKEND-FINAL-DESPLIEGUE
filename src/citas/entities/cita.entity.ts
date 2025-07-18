import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { User } from '../../users/entities/user.entity';

// Enum para los posibles estados de una cita
export enum EstadoCita {
  PROGRAMADA = 'Programada',
  COMPLETADA = 'Completada',
  CANCELADA = 'Cancelada',
}

@Entity({ name: 'citas' })
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' }) // 'timestamp' es mejor para guardar fecha y hora
  fechaCita: Date;

  @Column()
  motivo: string;

  @Column({
    type: 'enum',
    enum: EstadoCita,
    default: EstadoCita.PROGRAMADA,
  })
  estado: EstadoCita;

  // --- RELACIONES ---

  // Muchas citas pertenecen a una Mascota
  @ManyToOne(() => Mascota, (mascota) => mascota.citas)
  mascota: Mascota;

  // Muchas citas son atendidas por un Veterinario (User)
  @ManyToOne(() => User, (user) => user.citasAsignadas)
  veterinario: User;
}
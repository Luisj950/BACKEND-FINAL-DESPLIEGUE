// src/monitoreo/entities/monitoreo-alerta.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { forwardRef } from '@nestjs/common';
// ✅ 1. Se corrige la ruta de importación para apuntar al módulo 'mascotas'
import { Mascota } from '../../mascotas/entities/mascota.entity';

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
  tipoAlerta: string;

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

  // --- RELACION ---
  // ✅ 2. Se añade forwardRef para robustez
  @ManyToOne(() => Mascota, (mascota) => mascota.alertas)
  mascota: Mascota;
}
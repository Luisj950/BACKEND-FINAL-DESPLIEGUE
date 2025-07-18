// src/historias-clinicas/entities/historia-clinica.entity.ts

import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { AtencionMedica } from './atencion-medica.entity';

@Entity({ name: 'historias_clinicas' })
export class HistoriaClinica {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación uno a uno con Mascota. La tabla 'historias_clinicas' tendrá la foreign key.
  @OneToOne(() => Mascota, mascota => mascota.historiaClinica)
  @JoinColumn()
  mascota: Mascota;

  // Una historia clínica tiene muchas atenciones médicas
  @OneToMany(() => AtencionMedica, atencion => atencion.historiaClinica)
  atenciones: AtencionMedica[];

  // Aquí podrías añadir más relaciones como:
  // @OneToMany(() => Alergia, alergia => alergia.historiaClinica)
  // alergias: Alergia[];
}
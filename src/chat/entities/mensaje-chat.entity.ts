// src/chat/entities/mensaje-chat.entity.ts

import { User } from '../../users/entities/user.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';

@Entity({ name: 'mensajes_chat' })
export class MensajeChat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  mensaje: string;

  @CreateDateColumn({ name: 'fechaEnvio' })
  fechaEnvio: Date;
  
  @Column('boolean', { default: false })
  leido: boolean;

  // --- Relación con el Emisor ---
  @ManyToOne(() => User, user => user.mensajesEnviados)
  @JoinColumn({ name: 'remitenteId' })
  emisor: User;

  @Column()
  remitenteId: number;

  // --- Relación con el Destinatario ---
  @ManyToOne(() => User, user => user.mensajesRecibidos)
  @JoinColumn({ name: 'destinatarioId' })
  destinatario: User;

  @Column()
  destinatarioId: number;
}
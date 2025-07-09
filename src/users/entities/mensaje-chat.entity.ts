import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'mensajes_chat' })
export class MensajeChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  mensaje: string;

  @CreateDateColumn() // TypeORM insertará la fecha actual automáticamente
  fechaEnvio: Date;

  @Column({ default: false })
  leido: boolean;

  // --- RELACIONES ---

  // Muchos mensajes son enviados por un Usuario (Remitente)
  @ManyToOne(() => User)
  remitente: User;

  // Muchos mensajes son recibidos por un Usuario (Destinatario)
  @ManyToOne(() => User)
  destinatario: User;
}
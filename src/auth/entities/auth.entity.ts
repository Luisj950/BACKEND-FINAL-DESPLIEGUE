import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  correo: string;

  @Column()
  telefono: string;

  @Column()
  password: string;
    
    @Column({ default: false })
    isActive: boolean;
}

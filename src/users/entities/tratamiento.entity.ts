import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DetalleHistoriaClinica } from '../entities/detalle-historia-clinica.entity';

@Entity({ name: 'tratamientos' })
export class Tratamiento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    medicamento: string;

    @Column()
    dosis: string;

    @Column()
    frecuencia: string;

    @Column({ type: 'date' })
    fechaInicio: Date;

    @Column({ type: 'date', nullable: true })
    fechaFin: Date;

    // --- RELACIÓN ---
    // Un tratamiento específico pertenece a un único detalle de consulta en la historia clínica.
    @ManyToOne(() => DetalleHistoriaClinica, (detalle) => detalle.tratamientos)
    detalleHistoriaClinica: DetalleHistoriaClinica;
}
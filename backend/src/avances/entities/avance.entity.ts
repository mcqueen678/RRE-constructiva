import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoAvance {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  FINALIZADO = 'FINALIZADO',
}

@Entity('avances')
export class Avance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255 })
  imagenUrl: string;

  @Column({ type: 'enum', enum: EstadoAvance, default: EstadoAvance.EN_PROGRESO })
  estado: EstadoAvance;

  @CreateDateColumn()
  fechaRegistro: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity.js';

export type EstadoAvance = 'SO' | 'C' | 'M' | 'T' | 'A' | 'Te' | 'NS';

@Entity('avances')
export class Avance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ type: 'varchar', default: 'SO' })
  estado: EstadoAvance;

  @CreateDateColumn()
  fechaRegistro: Date;

  @Column({ type: 'uuid', nullable: true })
  clienteId: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.avances, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;
}

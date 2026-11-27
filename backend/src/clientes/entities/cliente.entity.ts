import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Avance } from '../../avances/entities/avance.entity.js';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  codigoProyecto: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  ruc: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ default: 'CSP' })
  modalidad: string;

  @Column()
  proyecto: string;

  @Column({ nullable: true })
  telefono: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @OneToMany(() => Avance, (avance) => avance.cliente, { cascade: true })
  avances: Avance[];
}

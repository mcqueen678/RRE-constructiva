import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Avance } from '../../avances/entities/avance.entity.js';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  empresa: string;

  @Column({ nullable: true })
  ruc: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  correo: string;

  @Column()
  proyecto: string;

  @Column({ nullable: true })
  ubicacion: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @OneToMany(() => Avance, (avance) => avance.cliente, { cascade: true })
  avances: Avance[];
}

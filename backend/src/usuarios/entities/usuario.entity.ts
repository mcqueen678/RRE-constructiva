import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  correo: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.SUPERVISOR })
  rol: RolUsuario;

  @CreateDateColumn()
  creadoEn: Date;
}
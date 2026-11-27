import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import type { EstadoAvance } from '../entities/avance.entity.js';

export class CreateAvanceDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  imagenUrl: string;

    @IsIn(['SO', 'C', 'M', 'T', 'A', 'Te', 'NS'])
  @IsOptional()
  estado?: EstadoAvance;

  @IsUUID()
  @IsNotEmpty()
  clienteId: string;
}

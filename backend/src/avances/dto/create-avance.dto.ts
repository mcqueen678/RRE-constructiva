import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoAvance } from '../entities/avance.entity.js';
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

  @IsEnum(EstadoAvance)
  @IsOptional()
  estado?: EstadoAvance;
}

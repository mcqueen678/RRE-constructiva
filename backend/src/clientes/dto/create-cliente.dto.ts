import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsOptional()
  codigoProyecto?: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  modalidad?: string;

  @IsString()
  @IsNotEmpty()
  proyecto: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}

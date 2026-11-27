import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  empresa?: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsNotEmpty()
  proyecto: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;
}

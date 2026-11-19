export type RolUsuario = 'ADMIN' | 'SUPERVISOR';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  creadoEn?: string;
}

export interface CrearUsuarioDto {
  nombre: string;
  correo: string;
  password: string;
  rol?: RolUsuario;
}

export interface LoginDto {
  correo: string;
  password: string;
}

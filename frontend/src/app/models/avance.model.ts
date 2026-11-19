export type EstadoAvance = 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADO';

export interface Avance {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  estado: EstadoAvance;
  fechaRegistro?: string;
}

export interface CrearAvanceDto {
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  estado?: EstadoAvance;
}

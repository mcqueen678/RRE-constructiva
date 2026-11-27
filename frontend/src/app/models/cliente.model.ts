import { Avance } from './avance.model';

export interface Cliente {
  id: string;
  codigoProyecto?: string;
  nombre: string;
  ruc?: string;
  direccion?: string;
  ubicacion?: string;
  modalidad?: string;
  proyecto: string;
  telefono?: string;
  fechaRegistro?: string;
  avances?: Avance[];
}

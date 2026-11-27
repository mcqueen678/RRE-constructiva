import { Avance } from './avance.model';

export interface Cliente {
  id: string;
  nombre: string;
  empresa?: string;
  ruc?: string;
  telefono?: string;
  correo?: string;
  proyecto: string;
  ubicacion?: string;
  fechaRegistro?: string;
  avances?: Avance[];
}

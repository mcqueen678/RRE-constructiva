import { Cliente } from './cliente.model';

export type EstadoAvance = 'SO' | 'C' | 'M' | 'T' | 'A' | 'Te' | 'NS';

export interface InfoEstadoObra {
  codigo: EstadoAvance;
  nombre: string;
  descripcion: string;
}

export const ESTADOS_OBRA: InfoEstadoObra[] = [
  { codigo: 'SO', nombre: 'SIN INICIO DE OBRA', descripcion: 'NO SE HA INICIADO OBRA' },
  { codigo: 'C', nombre: 'EN CIMIENTOS', descripcion: 'AVANCE DE OBRA A NIVEL DE CIMENTACION' },
  { codigo: 'M', nombre: 'EN MUROS', descripcion: 'AVANCE DE OBRA A NIVEL DE IZADO DE COLUMNAS Y LEVANTAMIENTO DE MUROS' },
  { codigo: 'T', nombre: 'EN TECHOS', descripcion: 'AVANCE DE OBRA A NIVEL DE VACEADO DE TECHOS' },
  { codigo: 'A', nombre: 'ACABADOS', descripcion: 'AVANCE DE OBRA A NIVEL DE ACABADOS' },
  { codigo: 'Te', nombre: 'TERMINADA', descripcion: 'LA VIVIENDA SE ENCUENTRA TERMINADA' },
  { codigo: 'NS', nombre: 'NO SUPERVISADA', descripcion: 'LA VIVIENDA NO SE PUDO SUPERVISAR, POR NO ENCONTRARSE EL PROPIETARIO.' },
];

export const obtenerNombreEstado = (codigo: string): string => {
  const encontrado = ESTADOS_OBRA.find((e) => e.codigo === codigo);
  return encontrado ? `${encontrado.codigo} - ${encontrado.nombre}` : codigo;
};

export interface Avance {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  estado: EstadoAvance;
  fechaRegistro?: string;
  clienteId?: string;
  cliente?: Cliente;
}

export interface CrearAvanceDto {
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  estado?: EstadoAvance;
  clienteId?: string;
}

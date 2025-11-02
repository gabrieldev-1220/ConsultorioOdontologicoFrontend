export interface Odontologo {
  idOdontologo: number;
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad?: string;
}

export interface EvolucionVisita {
  idEvolucion?: number;
  fecha: string;
  descripcion: string;
  profesional: string;
}

export interface ArchivoAdjunto {
  nombre: string;
  ruta: string;
}

export interface HistorialClinico {
  idHistorial?: number;
  idPaciente: number;
  idOdontologo: number;
  fecha: string; // ← Cambiado
  motivoConsulta: string;
  diagnostico: string;
  observacion?: string;
  planTratamiento: string;
  archivos?: ArchivoAdjunto[];
  odontologo?: Odontologo;
  evoluciones?: EvolucionVisita[];
}
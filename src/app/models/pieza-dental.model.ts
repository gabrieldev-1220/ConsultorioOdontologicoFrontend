// src/app/models/pieza-dental.model.ts
export type SectorKey = 'oclusal' | 'mesial' | 'distal' | 'bucal' | 'lingual';

export interface PiezaDental {
  idPieza?: number;
  idPaciente: number;
  numeroPieza: number; // 1..32
  color?: string;
  estado?: string;
  observaciones?: string | null;
  fechaActualizacion?: string | Date;

  // Propiedades que de utiliza en tiempo de ejecución en el frontend:
  // NOTA: no son persistidas directamente por EF; se guardan serializadas en `observaciones`.
  sectors?: Record<SectorKey, string>;
}

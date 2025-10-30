export interface AntecedentesMedicos {
  alergias?: string;
  enfermedades?: string;
  medicamentos?: string;
  cirugias?: string;
  otros?: string;
}

export interface ExamenExtraoral {
  atm?: string;
  ganglios?: string;
  simetriaFacial?: string;
  otros?: string;
}

export interface ExamenIntraoral {
  mucosas?: string;
  encias?: string;
  lengua?: string;
  pisoBoca?: string;
  otros?: string;
}

export interface EvolucionVisita {
  idEvolucion?: number;
  fecha: string;
  descripcion: string;
  profesional: string;
}

export interface HistorialClinico {
  idHistorial?: number;
  idPaciente: number;
  fechaCreacion: string;
  motivoConsulta: string;
  antecedentesMedicos: AntecedentesMedicos;
  antecedentesOdontologicos: string;
  examenExtraoral: ExamenExtraoral;
  examenIntraoral: ExamenIntraoral;
  diagnostico: string;
  planTratamiento: string;
  evoluciones: EvolucionVisita[]; // CORREGIDO: sin valor por defecto
  consentimientoInformado: boolean;
  fechaActualizacion?: string;
}
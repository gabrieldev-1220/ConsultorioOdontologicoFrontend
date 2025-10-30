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

// AÑADIDO: interfaz para odontólogo
export interface Odontologo {
  idOdontologo?: number;
  nombre: string;
  apellido: string;
  matricula?: string;
  telefono?: string;
  email?: string;
  especialidad?: string;
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
  evoluciones: EvolucionVisita[];
  consentimientoInformado: boolean;
  fechaActualizacion?: string;

  // AÑADIDO: campos del backend
  observacion?: string;
  odontologo?: Odontologo;
}
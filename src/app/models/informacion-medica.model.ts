export interface InformacionMedica {
  idInformacion?: number;
  idPaciente: number;
  alergias?: string;
  medicacionesActuales?: string;
  antecedentesMedicos?: string;
  antecedentesOdontologicos?: string;
  habitos?: string;
  observacionesMedicas?: string;
}
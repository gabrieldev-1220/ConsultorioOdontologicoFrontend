export interface Turno {
  idTurno: number;
  idPaciente: number;
  idOdontologo: number;
  fechaHora: Date;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'realizado';
  observaciones?: string; // Opcional según la base de datos
}
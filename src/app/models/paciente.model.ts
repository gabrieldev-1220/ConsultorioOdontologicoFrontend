export interface Paciente {
  idPaciente: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  telefono: string;
  email?: string;
  direccion?: string;
  fechaRegistro: string;
  activo: boolean;
  turnos?: any[];
  historiales?: any[];
  pagos?: any[];
}
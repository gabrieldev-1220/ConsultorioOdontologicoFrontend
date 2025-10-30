export interface Odontologo {
  idOdontologo: number;
  nombre: string;
  apellido: string;
  matricula: string;
  telefono: string;
  email?: string; // Opcional según la base de datos
  especialidad?: string; // Opcional según la base de datos
}
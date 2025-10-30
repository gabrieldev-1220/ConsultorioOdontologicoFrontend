export interface Tratamiento {
  idTratamiento: number;
  nombre: string;
  descripcion?: string; // Opcional según la base de datos
  precio: number;
}
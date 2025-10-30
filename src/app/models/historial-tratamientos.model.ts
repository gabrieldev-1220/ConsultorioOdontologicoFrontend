export interface HistorialTratamientos {
  idHistorialTratamiento: number;
  idHistorial: number;
  idTratamiento: number;
  cantidad: number;
  precioUnitario: number;
  tratamiento?: { nombre: string }; // Añadir esto si el backend lo incluye
}
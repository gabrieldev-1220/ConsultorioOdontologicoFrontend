export interface Bitacora {
  idBitacora: number;
  idUsuario: number;
  usuario?: { username: string }; // Añadir esto si el backend lo incluye
  accion: string;
  fecha: Date;
  detalles?: string; // Opcional según la base de datos
}
export interface Pago {
  idPago: number;
  idPaciente: number;
  fechaPago: Date;
  monto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string; // Opcional según la base de datos
  paciente?: { nombre: string }; // Añadir esto si el backend lo incluye
}
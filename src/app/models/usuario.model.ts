export interface Usuario {
  idUsuario: number;
  username: string;
  passwordHash: string;
  rol: 'admin' | 'odontologo' | 'recepcionista';
  idOdontologo?: number; // Opcional según la base de datos
}
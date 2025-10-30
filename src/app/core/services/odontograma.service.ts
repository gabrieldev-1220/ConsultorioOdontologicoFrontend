import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { PiezaDental } from '../../models/pieza-dental.model';

@Injectable({
  providedIn: 'root'
})
export class OdontogramaService {
  private base = 'Odontograma';

  constructor(private api: ApiService) {}

  // Obtener todas las piezas del paciente
  getPorPaciente(idPaciente: number): Observable<PiezaDental[]> {
    return this.api.get<PiezaDental[]>(`${this.base}/${idPaciente}`);
  }

  // Crear piezas iniciales para el paciente (32 piezas)
  crearInicial(idPaciente: number): Observable<PiezaDental[]> {
    return this.api.post<PiezaDental[]>(`${this.base}/${idPaciente}`, {});
  }

  // Actualizar piezas (envía lista de piezas)
  actualizarPorPaciente(idPaciente: number, piezas: PiezaDental[]): Observable<void> {
    return this.api.put<void>(`${this.base}/${idPaciente}`, piezas);
  }

  // Eliminar odontograma (opcional)
  eliminarPorPaciente(idPaciente: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${idPaciente}`);
  }
}

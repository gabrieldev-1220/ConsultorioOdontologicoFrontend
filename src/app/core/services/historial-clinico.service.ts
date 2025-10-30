import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';
import { HistorialClinico } from '../../models/historial-clinico.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialClinicoService {

  constructor(private apiService: ApiService) {}

  getPorPaciente(idPaciente: number): Observable<HistorialClinico[]> {
    return this.apiService.get<HistorialClinico[]>(`HistorialClinico/pacientes/${idPaciente}`);
  }

  getPorId(idHistorial: number): Observable<HistorialClinico> {
    return this.apiService.get<HistorialClinico>(`HistorialClinico/${idHistorial}`);
  }

  crear(historial: HistorialClinico): Observable<HistorialClinico> {
    return this.apiService.post<HistorialClinico>('HistorialClinico', historial);
  }

  actualizar(idHistorial: number, historial: HistorialClinico): Observable<HistorialClinico> {
    return this.apiService.put<HistorialClinico>(`HistorialClinico/${idHistorial}`, historial);
  }

  eliminar(idHistorial: number): Observable<void> {
    return this.apiService.delete<void>(`HistorialClinico/${idHistorial}`);
  }

  agregarEvolucion(idHistorial: number, evolucion: any): Observable<any> {
    return this.apiService.post<any>(`HistorialClinico/${idHistorial}/evolucion`, evolucion);
  }
}
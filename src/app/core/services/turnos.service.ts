import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Turno {
  id: number;
  paciente: string;
  odontologo: string;
  fecha: string;
  hora: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private apiUrl = `${environment.apiUrl}Turnos`;

  constructor(private http: HttpClient) {}

  getAgenda(startDate: Date, endDate: Date, idOdontologo?: number, token?: string): Observable<Turno[]> {
    // Formatear fechas correctamente con zona horaria
    const startISO = new Date(startDate).toISOString();
    const endISO = new Date(endDate).toISOString();

    let params = new HttpParams()
      .set('startDate', startISO)
      .set('endDate', endISO);

    if (idOdontologo) {
      params = params.set('idOdontologo', idOdontologo.toString());
    }

    const headers = token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : undefined;

    return this.http.get<Turno[]>(`${this.apiUrl}/agenda`, { params, headers });
  }
}
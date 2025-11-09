import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Odontologo {
  idOdontologo: number;
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OdontologosService {
  private apiUrl = `${environment.apiUrl}Odontologo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Odontologo[]> {
    return this.http.get<Odontologo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Odontologo> {
    return this.http.get<Odontologo>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Odontologo[]> {
    return this.http.get<Odontologo[]>(`${this.apiUrl}/search?query=${query}`);
  }

  create(odontologo: Odontologo): Observable<Odontologo> {
    return this.http.post<Odontologo>(this.apiUrl, odontologo);
  }

  update(id: number, odontologo: Odontologo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, odontologo);
  }
}
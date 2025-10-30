import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { Procedimiento } from '../../models/procedimiento.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientosService {
  private base = 'Procedimientos';

  constructor(private api: ApiService) {}

  getAll(): Observable<Procedimiento[]> {
    return this.api.get<Procedimiento[]>(this.base);
  }

  getCategorias(): Observable<string[]> {
    return this.api.get<string[]>(`${this.base}/categorias`);
  }
}
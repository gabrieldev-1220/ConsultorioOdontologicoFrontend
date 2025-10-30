import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';
import { InformacionMedica } from '../../models/informacion-medica.model';

@Injectable({
  providedIn: 'root'
})
export class InformacionMedicaService {

  constructor(private apiService: ApiService) {}

  getPorPaciente(idPaciente: number): Observable<InformacionMedica> {
    return this.apiService.get<InformacionMedica>(`InformacionMedica/paciente/${idPaciente}`);
  }

  crear(info: InformacionMedica): Observable<InformacionMedica> {
    return this.apiService.post<InformacionMedica>('InformacionMedica', info);
  }

  actualizar(id: number, info: InformacionMedica): Observable<any> {
    return this.apiService.put<any>(`InformacionMedica/${id}`, info);
  }
}
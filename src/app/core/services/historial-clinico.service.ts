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

  crearConArchivos(historial: HistorialClinico, archivos: File[]): Observable<HistorialClinico> {
    const formData = new FormData();
    formData.append('IdPaciente', historial.idPaciente.toString());
    formData.append('IdOdontologo', historial.idOdontologo.toString());
    formData.append('MotivoConsulta', historial.motivoConsulta);
    formData.append('Diagnostico', historial.diagnostico);
    formData.append('Observacion', historial.observacion || '');
    formData.append('PlanTratamiento', historial.planTratamiento);

    archivos.forEach((file, index) => {
      formData.append(`archivos`, file, file.name);
    });

    return this.apiService.postForm<HistorialClinico>('HistorialClinico', formData);
  }

  descargarPdf(id: number): Observable<Blob> {
    return this.apiService.getBlob(`HistorialClinico/${id}/pdf`);
  }
}
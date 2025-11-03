import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../../models/paciente.model';
import { HistorialClinico } from '../../../models/historial-clinico.model';

interface OdontogramaHistorial {
  fecha: string;
  odontologo: string;
  procedimientos: string[];
}

@Component({
  selector: 'app-paciente-ficha',
  standalone: false,
  templateUrl: './paciente-ficha.component.html',
  styleUrls: ['./paciente-ficha.component.scss']
})
export class PacienteFichaComponent implements OnInit {
  pacienteId: number = 0;
  paciente: Paciente | null = null;
  historial: HistorialClinico[] = [];
  selectedTab: string = 'contacto';
  mostrarHistorialOdontogramas = false;
  odontogramasHistorial: OdontogramaHistorial[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPaciente();
    this.loadHistorial();
    this.loadHistorialOdontogramas();
  }

  loadPaciente() {
    this.apiService.get<Paciente>(`Pacientes/${this.pacienteId}`).subscribe({
      next: (data) => this.paciente = data,
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al cargar paciente');
      }
    });
  }

  loadHistorial() {
    this.apiService.get<HistorialClinico[]>(`Pacientes/${this.pacienteId}/historial`).subscribe({
      next: (data) => this.historial = data,
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al cargar historial');
      }
    });
  }

  loadHistorialOdontogramas() {
    // Simulación de datos (reemplazar con API real)
    this.odontogramasHistorial = [
      {
        fecha: '2025-10-15',
        odontologo: 'María Gómez',
        procedimientos: ['Limpieza', 'Sellante']
      },
      {
        fecha: '2025-08-20',
        odontologo: 'Juan Pérez',
        procedimientos: ['Extracción', 'Radiografía']
      }
    ];
  }

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  seleccionarOdontograma(odontograma: OdontogramaHistorial) {
    this.toastr.info(`Odontograma del ${odontograma.fecha} por Dr. ${odontograma.odontologo}`);
    // Aquí podrías abrir un modal con el odontograma completo
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { HistorialClinicoService } from '../../core/services/historial-clinico.service';
import { InformacionMedicaService } from '../../core/services/informacion-medica.service';
import { HistorialClinico } from '../../models/historial-clinico.model';
import { InformacionMedica } from '../../models/informacion-medica.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-clinico',
  standalone: false,
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.scss']
})
export class HistorialClinicoComponent implements OnInit {
  @Input() pacienteId!: number;
  historiales: HistorialClinico[] = [];
  infoMedica: InformacionMedica | null = null;
  historialSeleccionado: HistorialClinico | null = null;

  constructor(
    private historialService: HistorialClinicoService,
    private infoMedicaService: InformacionMedicaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarHistoriales();
    this.cargarInfoMedica();
  }

  cargarHistoriales() {
    this.historialService.getPorPaciente(this.pacienteId).subscribe({
      next: (data) => this.historiales = data || [],
      error: () => console.error('Error al cargar historiales')
    });
  }

  cargarInfoMedica() {
    this.infoMedicaService.getPorPaciente(this.pacienteId).subscribe({
      next: (data) => this.infoMedica = data,
      error: () => this.infoMedica = null
    });
  }

  nuevoHistorial() {
    this.router.navigate(['/historial-form', this.pacienteId]);
  }

  abrirModal(historial: HistorialClinico) {
    this.historialSeleccionado = historial;
  }

  cerrarModal() {
    this.historialSeleccionado = null;
  }
}
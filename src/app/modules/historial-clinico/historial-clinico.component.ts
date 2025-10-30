import { Component, Input, OnInit } from '@angular/core';
import { HistorialClinicoService } from '../../core/services/historial-clinico.service';
import { HistorialClinico } from '../../models/historial-clinico.model';
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

  constructor(
    private historialService: HistorialClinicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarHistoriales();
  }

  cargarHistoriales() {
    this.historialService.getPorPaciente(this.pacienteId).subscribe({
      next: (data) => {
        this.historiales = (data || []).map(h => ({
          ...h,
          evoluciones: h.evoluciones || [] // Asegurar que siempre exista
        }));
      },
      error: (err) => {
        console.error('Error al cargar historiales del paciente', this.pacienteId, err);
        this.historiales = [];
      }
    });
  }

  nuevoHistorial() {
    this.router.navigate(['/historial-form', this.pacienteId]);
  }

  verHistorial(historial: HistorialClinico) {
    this.router.navigate(['/historial-form', this.pacienteId, historial.idHistorial]);
  }
}
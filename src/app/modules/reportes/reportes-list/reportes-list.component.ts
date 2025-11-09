import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';

interface Reporte {
  pacientesNuevos: number;
  ingresos: number;
  turnosAtendidos: number;
  tratamientoTop: string;
  ocupacion: string;
}

@Component({
  selector: 'app-reportes-list',
  standalone: false,
  templateUrl: './reportes-list.component.html',
  styleUrl: './reportes-list.component.scss'
})
export class ReportesListComponent implements OnInit {
  reporte: Reporte = {
    pacientesNuevos: 0,
    ingresos: 0,
    turnosAtendidos: 0,
    tratamientoTop: 'N/A',
    ocupacion: '0%'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadReportes();
  }

  loadReportes() {
    this.apiService.get<any>('Pacientes').subscribe(pacientes => {
      this.reporte.pacientesNuevos = Array.isArray(pacientes) ? pacientes.length : 0;
    });

    this.apiService.get<any>('Pagos').subscribe(pagos => {
      const total = Array.isArray(pagos)
        ? pagos.reduce((sum: number, p: any) => sum + (p.monto || 0), 0)
        : 0;
      this.reporte.ingresos = total;
    });

    this.apiService.get<any>('Turnos').subscribe(turnos => {
      const atendidos = Array.isArray(turnos)
        ? turnos.filter((t: any) => t.estado === 'realizado').length
        : 0;
      this.reporte.turnosAtendidos = atendidos;
      const totalTurnos = Array.isArray(turnos) ? turnos.length : 1;
      this.reporte.ocupacion = totalTurnos > 0 ? Math.round((atendidos / totalTurnos) * 100) + '%' : '0%';
    });

    // Tratamiento más común (simulado)
    this.reporte.tratamientoTop = 'Limpieza Dental';
  }
}
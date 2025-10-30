import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reportes',
  standalone:false,
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  reportes: { ingresos?: number; deudas?: any[] } = {};

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadReportes();
  }

  loadReportes() {
    this.apiService.get<number>('Reportes/ingresos?startDate=2023-01-01&endDate=2023-12-31').subscribe(data => this.reportes.ingresos = data, error => this.toastr.error('Error al cargar ingresos'));
    this.apiService.get<any[]>('Reportes/deudas-pendientes').subscribe(data => this.reportes.deudas = data, error => this.toastr.error('Error al cargar deudas'));
  }
}
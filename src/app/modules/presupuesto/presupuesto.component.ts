import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

interface PresupuestoItem {
  fecha: string;
  nombreProcedimiento: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

@Component({
  selector: 'app-presupuesto',
  standalone: false,
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent implements OnInit {
  @Input() pacienteId!: number;
  presupuestos: PresupuestoItem[] = [];
  totalPresupuesto: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarPresupuesto();
  }

  cargarPresupuesto() {
    // Simulación: en el futuro llamará a API
    this.presupuestos = [
      {
        fecha: '2025-10-15',
        nombreProcedimiento: 'Ortodoncia',
        cantidad: 1,
        precioUnitario: 1200.00,
        total: 1200.00
      },
      {
        fecha: '2025-10-15',
        nombreProcedimiento: 'Limpieza',
        cantidad: 1,
        precioUnitario: 80.00,
        total: 80.00
      }
    ];
    this.calcularTotal();
  }

  calcularTotal() {
    this.totalPresupuesto = this.presupuestos.reduce((sum, item) => sum + item.total, 0);
  }

  generarNuevo() {
    alert('Funcionalidad en desarrollo: Generar nuevo presupuesto');
  }

  imprimir() {
    window.print();
  }
}
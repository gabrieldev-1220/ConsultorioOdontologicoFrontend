import { Component, Input, OnInit } from '@angular/core';

interface Pago {
  fecha: string;
  concepto: string;
  monto: number;
  estado: 'pagado' | 'pendiente';
}

@Component({
  selector: 'app-facturacion',
  standalone: false,
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})
export class FacturacionComponent implements OnInit {
  @Input() pacienteId!: number;
  pagos: Pago[] = [];
  totalPagado = 0;

  ngOnInit() {
    this.pagos = [
      { fecha: '2025-10-15', concepto: 'Limpieza dental', monto: 4000, estado: 'pagado' },
      { fecha: '2025-09-10', concepto: 'Consulta inicial', monto: 2000, estado: 'pagado' },
      { fecha: '2025-11-01', concepto: 'Ortodoncia mensual', monto: 5000, estado: 'pendiente' }
    ];

    this.totalPagado = this.pagos
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + p.monto, 0);
  }
}
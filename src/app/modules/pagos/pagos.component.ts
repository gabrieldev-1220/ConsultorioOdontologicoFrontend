import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

interface Pago {
  id: number;
  idPaciente: number;
  fecha: string;
  monto: number;
  metodo: 'tarjeta' | 'transferencia' | 'efectivo';
}

@Component({
  selector: 'app-pagos',
  standalone: false,
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss'
})
export class PagosComponent implements OnInit {
  @Input() pacienteId!: number;
  pagos: Pago[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (this.pacienteId) {
      this.loadPagos();
    }
  }

  loadPagos() {
    this.apiService.get<Pago[]>(`Pacientes/${this.pacienteId}/pagos`).subscribe({
      next: (data) => {
        this.pagos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      error: () => {
        this.pagos = [];
      }
    });
  }

  editarPago(pago: Pago) {
    // Lógica futura para editar pago
    console.log('Editar pago:', pago);
  }
}
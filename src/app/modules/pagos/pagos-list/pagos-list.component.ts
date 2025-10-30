import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Pago } from '../../../models/pago.model';

@Component({
  selector: 'app-pagos-list',
  standalone: false,
  templateUrl: './pagos-list.component.html',
  styleUrls: ['./pagos-list.component.scss']
})
export class PagosListComponent implements OnInit {
  pagos: Pago[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadPagos();
  }

  loadPagos() {
    this.apiService.get<Pago[]>('Pagos').subscribe(
      data => this.pagos = data,
      error => {
        console.error('Error al cargar pagos:', error);
        this.toastr.error('Acceso denegado: Rol insuficiente o error en el servidor');
      }
    );
  }
}
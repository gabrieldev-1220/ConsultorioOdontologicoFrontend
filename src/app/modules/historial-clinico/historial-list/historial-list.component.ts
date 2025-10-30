import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HistorialClinico } from '../../../models/historial-clinico.model';

@Component({
  selector: 'app-historial-list',
  standalone: false,
  templateUrl: './historial-list.component.html',
  styleUrls: ['./historial-list.component.scss']
})
export class HistorialListComponent implements OnInit {
  historiales: HistorialClinico[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadHistoriales();
  }

  loadHistoriales() {
    this.apiService.get<HistorialClinico[]>('HistorialClinico').subscribe(data => this.historiales = data, error => this.toastr.error('Error al cargar historial clínico'));
  }
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HistorialTratamientos } from '../../../models/historial-tratamientos.model';

@Component({
  selector: 'app-hist-trat-list',
  standalone: false,
  templateUrl: './hist-trat-list.component.html',
  styleUrls: ['./hist-trat-list.component.scss']
})
export class HistTratListComponent implements OnInit {
  historialTratamientos: HistorialTratamientos[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadHistorialTratamientos();
  }

  loadHistorialTratamientos() {
    this.apiService.get<HistorialTratamientos[]>('HistorialTratamientos').subscribe(data => this.historialTratamientos = data, error => this.toastr.error('Error al cargar historial de tratamientos'));
  }
}
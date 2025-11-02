import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

interface Tratamiento {
  idTratamiento: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

@Component({
  selector: 'app-tratamientos',
  standalone: false,
  templateUrl: './tratamientos.component.html',
  styleUrls: ['./tratamientos.component.scss']
})
export class TratamientosComponent implements OnInit {
  tratamientos: Tratamiento[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadTratamientos();
  }

  loadTratamientos() {
    this.apiService.get<Tratamiento[]>('Tratamientos').subscribe({
      next: (data) => this.tratamientos = data,
      error: () => this.toastr.error('Error al cargar tratamientos')
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Tratamiento } from '../../../models/tratamiento.model';

@Component({
  selector: 'app-tratamientos-list',
  standalone:false,
  templateUrl: './tratamientos-list.component.html',
  styleUrls: ['./tratamientos-list.component.scss']
})
export class TratamientosListComponent implements OnInit {
  tratamientos: Tratamiento[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadTratamientos();
  }

  loadTratamientos() {
    this.apiService.get<Tratamiento[]>('Tratamientos').subscribe(data => this.tratamientos = data, error => this.toastr.error('Error al cargar tratamientos'));
  }
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Odontologo } from '../../../models/odontologo.model';

@Component({
  selector: 'app-odontologos-list',
  standalone: false,
  templateUrl: './odontologos-list.component.html',
  styleUrls: ['./odontologos-list.component.scss']
})
export class OdontologosListComponent implements OnInit {
  odontologos: Odontologo[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadOdontologos();
  }

  loadOdontologos() {
    this.apiService.get<Odontologo[]>('Odontologo').subscribe({
      next: (data) => {
        this.odontologos = data || [];
      },
      error: () => {
        this.toastr.error('Error al cargar odontólogos');
        this.odontologos = [];
      }
    });
  }
}
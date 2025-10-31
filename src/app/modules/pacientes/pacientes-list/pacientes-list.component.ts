import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-pacientes-list',
  standalone: false,
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.scss']
})
export class PacientesListComponent implements OnInit {
  pacientes: Paciente[] = [];
  filteredPacientes: Paciente[] = [];
  searchQuery: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.apiService.get<Paciente[]>('Pacientes').subscribe({
      next: (data) => {
        this.pacientes = data;
        this.filteredPacientes = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.apellido.toLowerCase().includes(query) ||
      p.dni.includes(query)
    );
  }

  addPaciente() {
    this.router.navigate(['/pacientes/new']);
  }

  viewFicha(id: number) {
    this.router.navigate(['/pacientes', id]);
  }
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../../models/paciente.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

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
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.apiService.get<Paciente[]>('Pacientes').subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = Array.isArray(data) ? data : [];
        this.filteredPacientes = [...this.pacientes];
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.toastr.error('Acceso denegado: Rol insuficiente o error en el servidor');
        this.pacientes = [];
        this.filteredPacientes = [];
      }
    });
  }

  onSearch() {
    this.filteredPacientes = this.pacientes.filter(paciente =>
      paciente.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      paciente.dni.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addPaciente() {
    this.router.navigate(['/pacientes/new']);
  }

  viewFicha(id: number) {
    this.router.navigate([`/pacientes/${id}`]); // Cambiado
  }
}
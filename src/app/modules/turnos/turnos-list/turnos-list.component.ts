import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Turno } from '../../../models/turno.model';
import { AuthService } from '../../../core/services/auth.service';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-turnos-list',
  standalone: false,
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.scss']
})
export class TurnosListComponent implements OnInit {
  turnos: Turno[] = [];
  pacientes: Paciente[] = [];
  loading: boolean = true;
  noDataMessage: string = '';

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTurnos();
    this.loadPacientes();
  }

  loadTurnos() {
    this.loading = true;
    this.noDataMessage = '';

    const idOdontologo = this.authService.getIdOdontologo();
    if (!idOdontologo) {
      this.toastr.error('Error: No se pudo identificar el odontólogo');
      this.loading = false;
      return;
    }

    const ahora = new Date();
    const startDate = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0).toISOString();
    const endDate = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 0, 0, 0).toISOString();

    this.apiService
      .get<Turno[]>(`Turnos/agenda?startDate=${startDate}&endDate=${endDate}&idOdontologo=${idOdontologo}`, true)
      .subscribe(
        data => {
          this.turnos = Array.isArray(data) ? data : [];
          if (this.turnos.length === 0) {
            this.noDataMessage = 'No hay turnos programados.';
          }
          this.loading = false;
        },
        error => {
          console.error('Error al cargar turnos:', error);
          this.toastr.error('Error al cargar turnos. Intenta de nuevo.');
          this.loading = false;
        }
      );
  }

  loadPacientes() {
    this.apiService.get<Paciente[]>('Pacientes', true).subscribe(
      (pacientes) => { this.pacientes = Array.isArray(pacientes) ? pacientes : []; },
      (error) => {
        console.error('Error cargando pacientes:', error);
        this.pacientes = [];
        this.toastr.error('Error al cargar pacientes. Intenta de nuevo.');
      }
    );
  }

  getPacienteName(idPaciente: number): string {
    const paciente = this.pacientes.find(p => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente no encontrado';
  }
}

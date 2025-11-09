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

    // CORREGIDO: Parámetros correctos → endpoint, params?, handleErrorLocally
    this.apiService
      .get<Turno[]>(`Turnos/odontologo/${idOdontologo}`, undefined, true)
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
    // CORREGIDO: Parámetros correctos
    this.apiService.get<Paciente[]>('Pacientes', undefined, true).subscribe(
      (pacientes) => { 
        this.pacientes = Array.isArray(pacientes) ? pacientes : []; 
      },
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

  // FUNCIÓN AGREGADA: Para mostrar nombre del odontólogo (opcional)
  getOdontologoName(idOdontologo: number): string {
    return `Odontólogo #${idOdontologo}`;
  }
}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Paciente } from '../../models/paciente.model';
import { TurnosService, Turno as TurnoServiceModel } from '../../core/services/turnos.service';
import { HistorialClinico } from '../../models/historial-clinico.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  rol: string = '';
  sidebarActive: boolean = true;
  showProfileMenu: boolean = false;

  stats = {
    pacientesTotal: 0,
    turnosHoy: 0,
    historialesHoy: 0,
    loading: true
  };

  turnosHoy: TurnoServiceModel[] = [];
  pacientes: Paciente[] = [];
  today: Date = new Date();

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private turnosService: TurnosService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.rol = this.authService.getRol();
    this.username = this.authService.getFullName() || 'Odontólogo Desconocido';
    this.loadDashboardData();

    if (this.rol === 'odontologo') {
      this.loadTurnosHoy();
      this.loadPacientes();
    }
  }

  loadDashboardData() {
    this.stats.loading = true;

    // Pacientes
    this.apiService.get<Paciente[]>('Pacientes').subscribe({
      next: (data: Paciente[]) => {
        this.stats.pacientesTotal = Array.isArray(data) ? data.length : 0;
        this.pacientes = Array.isArray(data) ? data : [];
      },
      error: () => {
        this.stats.pacientesTotal = 0;
        this.pacientes = [];
      }
    });

    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1, 0, 0, 0);
    const idOdontologo = this.authService.getIdOdontologo();

    // Turnos del día
    if (idOdontologo) {
      this.turnosService.getAgenda(inicioDia, finDia, +idOdontologo).subscribe({
        next: (data: TurnoServiceModel[]) => {
          this.stats.turnosHoy = Array.isArray(data) ? data.length : 0;
        },
        error: () => { this.stats.turnosHoy = 0; }
      });
    } else {
      this.stats.turnosHoy = 0;
    }

    // Historiales
    if (this.rol === 'admin' || this.rol === 'odontologo') {
      this.apiService.get<HistorialClinico[]>('HistorialClinico').subscribe({
        next: (data: HistorialClinico[]) => {
          if (Array.isArray(data)) {
            this.stats.historialesHoy = data.filter(h => {
              const fechaHistorial = new Date(h.fecha);
              return fechaHistorial.toDateString() === hoy.toDateString();
            }).length;
          } else {
            this.stats.historialesHoy = 0;
          }
        },
        error: () => { this.stats.historialesHoy = 0; }
      });
    }

    setTimeout(() => { this.stats.loading = false; }, 1500);
  }

  loadTurnosHoy() {
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1, 0, 0, 0);
    const idOdontologo = this.authService.getIdOdontologo();

    if (idOdontologo) {
      this.turnosService.getAgenda(inicioDia, finDia, +idOdontologo).subscribe({
        next: (data: TurnoServiceModel[]) => {
          this.turnosHoy = Array.isArray(data)
            ? data.sort((a, b) => {
                const dateA = new Date(`${a.fecha}T${a.hora}`);
                const dateB = new Date(`${b.fecha}T${b.hora}`);
                return dateA.getTime() - dateB.getTime();
              })
            : [];
        },
        error: () => { this.turnosHoy = []; }
      });
    } else {
      this.turnosHoy = [];
    }
  }

  loadPacientes() {
    this.apiService.get<Paciente[]>('Pacientes').subscribe({
      next: (data: Paciente[]) => { this.pacientes = Array.isArray(data) ? data : []; },
      error: () => { this.pacientes = []; }
    });
  }

  getPacienteName(idPaciente: number): string {
    const paciente = this.pacientes.find(p => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente no encontrado';
  }
}
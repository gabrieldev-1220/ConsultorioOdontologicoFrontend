import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { TurnosService, Turno } from '../../core/services/turnos.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Paciente } from '../../models/paciente.model';

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

  turnosHoy: Turno[] = [];
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

    // CAMBIO: Carga turnos si es odontologo O admin
    if (this.rol === 'odontologo' || this.rol === 'admin') {
      this.loadTurnosHoy();
      this.loadPacientes();
    }
  }

  loadDashboardData() {
    this.stats.loading = true;

    // Pacientes totales
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
    const token = this.authService.getToken();

    // Turnos hoy (contador)
    if (idOdontologo && token) {
      this.turnosService.getAgenda(inicioDia, finDia, +idOdontologo, token).subscribe({
        next: (data: Turno[]) => {
          this.stats.turnosHoy = Array.isArray(data) ? data.length : 0;
        },
        error: (err) => {
          console.error('Error al cargar turnos para contador:', err);
          this.stats.turnosHoy = 0;
        }
      });
    } else {
      this.stats.turnosHoy = 0;
    }

    // Historiales hoy
    if (this.rol === 'admin' || this.rol === 'odontologo') {
      this.apiService.get<any[]>('HistorialClinico').subscribe({
        next: (data: any[]) => {
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
    const token = this.authService.getToken();

    if (idOdontologo && token) {
      this.turnosService.getAgenda(inicioDia, finDia, +idOdontologo, token).subscribe({
        next: (data: Turno[]) => {
          this.turnosHoy = Array.isArray(data)
            ? data.sort((a, b) => {
                const timeA = new Date(`${a.fecha}T${a.hora}`).getTime();
                const timeB = new Date(`${b.fecha}T${b.hora}`).getTime();
                return timeA - timeB;
              })
            : [];
        },
        error: (err) => {
          console.error('Error al cargar turnos del día:', err);
          this.turnosHoy = [];
          this.toastr.error('No se pudieron cargar los turnos del día.');
        }
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

  getOdontologoName(odontologo: { nombre: string; apellido: string }): string {
    return `Dr. ${odontologo.nombre} ${odontologo.apellido}`;
  }
}
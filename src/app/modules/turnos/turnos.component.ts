import { Component, OnInit } from '@angular/core';
import { TurnosService, Turno } from '../../core/services/turnos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-turnos',
  standalone: false,
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  turnos: Turno[] = [];
  loading = false;
  filtroForm!: FormGroup;

  constructor(
    private turnosService: TurnosService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      idOdontologo: [this.authService.getIdOdontologo() || '']
    });

    // CARGAR TURNOS DEL ODONTÓLOGO LOGUEADO
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    const token = localStorage.getItem('token') || '';
    const { startDate, endDate, idOdontologo } = this.filtroForm.value;

    this.loading = true;

    // Usa el ID del odontólogo logueado si no se especifica
    const id = idOdontologo || this.authService.getIdOdontologo();

    if (!startDate && !endDate) {
      // CARGAR TODOS LOS TURNOS DEL ODONTÓLOGO
      this.turnosService.getAgenda(new Date('1970-01-01'), new Date('2100-12-31'), id ? +id : undefined, token)
        .subscribe({
          next: (data: Turno[]) => {
            this.turnos = data || [];
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error al obtener los turnos:', err);
            this.loading = false;
          }
        });
    } else {
      this.turnosService.getAgenda(startDate || new Date(), endDate || new Date(), id ? +id : undefined, token)
        .subscribe({
          next: (data: Turno[]) => {
            this.turnos = data || [];
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error al obtener los turnos:', err);
            this.loading = false;
          }
        });
    }
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({
      startDate: null,
      endDate: null,
      idOdontologo: this.authService.getIdOdontologo() || ''
    });
    this.cargarTurnos();
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'status-pendiente';
      case 'confirmado': return 'status-confirmado';
      case 'en curso': return 'status-en-curso';
      case 'realizado': return 'status-realizado';
      case 'cancelado': return 'status-cancelado';
      default: return 'status-default';
    }
  }
}
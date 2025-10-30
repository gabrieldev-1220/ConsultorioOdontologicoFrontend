import { Component, OnInit } from '@angular/core';
import { TurnosService, Turno } from '../../core/services/turnos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-turnos',
  standalone: false,
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  turnos: Turno[] = [];
  dataSource = new MatTableDataSource<Turno>();
  loading = false;

  filtroForm!: FormGroup;
  displayedColumns: string[] = ['paciente', 'odontologo', 'fecha', 'hora', 'estado'];

  constructor(private turnosService: TurnosService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      startDate: [new Date()],
      endDate: [new Date()],
      idOdontologo: ['']
    });
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    const token = localStorage.getItem('token') || '';
    const { startDate, endDate, idOdontologo } = this.filtroForm.value;

    this.loading = true;
    this.turnosService.getAgenda(startDate, endDate, idOdontologo, token)
      .subscribe({
        next: (data: Turno[]) => {
          this.turnos = data || [];
          this.dataSource.data = this.turnos;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al obtener los turnos:', err);
          this.loading = false;
        }
      });
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({
      startDate: new Date(),
      endDate: new Date(),
      idOdontologo: ''
    });
    this.cargarTurnos();
  }
}

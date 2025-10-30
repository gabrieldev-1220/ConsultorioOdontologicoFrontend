import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paciente } from '../../../models/paciente.model';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paciente-detail',
  standalone: false,
  templateUrl: './paciente-detail.component.html',
  styleUrls: ['./paciente-detail.component.scss']
})
export class PacienteDetailComponent implements OnInit {
  pacienteId!: number;
  paciente!: Paciente;
  activeTab: 'info' | 'odontograma' | 'historial' | 'presupuesto' = 'info';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPaciente();
  }

  loadPaciente() {
    this.apiService.get<Paciente>(`Pacientes/${this.pacienteId}`).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
      },
      error: () => this.toastr.error('Error al cargar paciente')
    });
  }

  setTab(tab: 'info' | 'odontograma' | 'historial' | 'presupuesto') {
    this.activeTab = tab;
  }
}
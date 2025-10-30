import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';
import { AuthService } from '../../../core/services/auth.service';
import { InformacionMedicaService } from '../../../core/services/informacion-medica.service';
import { HistorialClinico } from '../../../models/historial-clinico.model';
import { InformacionMedica } from '../../../models/informacion-medica.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historial-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-form.component.html',
  styleUrls: ['./historial-form.component.scss']
})
export class HistorialFormComponent implements OnInit {
  pacienteId!: number;
  idOdontologo!: number;
  infoMedica: InformacionMedica | null = null;
  archivos: File[] = [];
  historial: HistorialClinico = {
    idPaciente: 0,
    idOdontologo: 0,
    fecha: new Date().toISOString(),
    motivoConsulta: '',
    diagnostico: '',
    observacion: '',
    planTratamiento: ''
  };

  constructor(
    public authService: AuthService, // ← PUBLIC
    private route: ActivatedRoute,
    private router: Router,
    private historialService: HistorialClinicoService,
    private infoMedicaService: InformacionMedicaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('id')!;
    this.idOdontologo = +this.authService.getIdOdontologo()!;
    this.historial.idPaciente = this.pacienteId;
    this.historial.idOdontologo = this.idOdontologo;

    this.infoMedicaService.getPorPaciente(this.pacienteId).subscribe({
      next: (data: InformacionMedica) => this.infoMedica = data
    });
  }

  onFileSelected(event: any) {
    this.archivos = Array.from(event.target.files);
  }

  getOdontologoNombre(): string {
    return this.authService.getFullName() || 'Odontólogo';
  }

  getMatricula(): string {
    return this.authService.getMatricula() || 'N/A';
  }

  guardar(crearCita: boolean = false) {
    this.historialService.crearConArchivos(this.historial, this.archivos).subscribe({
      next: (nuevo: HistorialClinico) => {
        this.toastr.success('Historial creado con éxito');
        if (crearCita) {
          this.router.navigate(['/turnos/nuevo', this.pacienteId]);
        } else {
          this.router.navigate(['/pacientes']);
        }
      },
      error: () => this.toastr.error('Error al guardar')
    });
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }
}
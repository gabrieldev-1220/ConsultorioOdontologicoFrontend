import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';
import { HistorialClinico } from '../../../models/historial-clinico.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historial-form',
  standalone: false,
  templateUrl: './historial-form.component.html',
  styleUrls: ['./historial-form.component.scss']
})
export class HistorialFormComponent implements OnInit {
  pacienteId!: number;
  historialId?: number;
  historial!: HistorialClinico;
  esNuevo = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private historialService: HistorialClinicoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.pacienteId = +this.route.snapshot.paramMap.get('pacienteId')!;
    this.historialId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : undefined;

    this.esNuevo = !this.historialId;
    this.iniciarHistorial();
    if (!this.esNuevo) {
      this.cargarHistorial();
    }
  }

  iniciarHistorial() {
    this.historial = {
      idPaciente: this.pacienteId,
      fechaCreacion: new Date().toISOString().split('T')[0],
      motivoConsulta: '',
      antecedentesMedicos: {},
      antecedentesOdontologicos: '',
      examenExtraoral: {},
      examenIntraoral: {},
      diagnostico: '',
      planTratamiento: '',
      evoluciones: [],
      consentimientoInformado: false
    };
  }

  cargarHistorial() {
    this.historialService.getPorId(this.historialId!).subscribe({
      next: (data) => this.historial = data,
      error: () => this.toastr.error('Error al cargar historial')
    });
  }

  guardar() {
    const accion = this.esNuevo
      ? this.historialService.crear(this.historial)
      : this.historialService.actualizar(this.historialId!, this.historial);

    accion.subscribe({
      next: () => {
        this.toastr.success('Historial guardado');
        this.volver();
      },
      error: () => this.toastr.error('Error al guardar')
    });
  }

  agregarEvolucion() {
    this.historial.evoluciones.push({
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      profesional: ''
    });
  }

  eliminarEvolucion(index: number) {
    this.historial.evoluciones.splice(index, 1);
  }

  volver() {
    this.router.navigate(['/pacientes', this.pacienteId]);
  }
}
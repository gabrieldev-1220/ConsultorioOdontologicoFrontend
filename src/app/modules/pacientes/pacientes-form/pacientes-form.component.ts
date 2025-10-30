import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../../models/paciente.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pacientes-form',
  standalone: false,
  templateUrl: './pacientes-form.component.html',
  styleUrls: ['./pacientes-form.component.scss']
})
export class PacientesFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;

  // Declarar router como propiedad pública
  public router: Router;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    router: Router, // Inyectar Router
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.router = router; // Asignar el Router a la propiedad pública
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,20}$/)]],
      email: [''],
      direccion: [''],
      activo: [true]
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<Paciente>(`Pacientes/${this.id}`).subscribe(
        data => this.form.patchValue(data),
        error => this.toastr.error('Error al cargar paciente')
      );
    }
  }

  onSubmit() {
    const pacienteData = this.form.value;
    if (this.id) {
      this.apiService.put<Paciente>(`Pacientes/${this.id}`, pacienteData).subscribe(
        () => {
          this.toastr.success('Paciente actualizado');
          this.router.navigate(['/pacientes']);
        },
        error => this.toastr.error('Error al actualizar')
      );
    } else {
      this.apiService.post<Paciente>('Pacientes', pacienteData).subscribe(
        () => {
          this.toastr.success('Paciente creado');
          this.router.navigate(['/pacientes']);
        },
        error => this.toastr.error('Error al crear')
      );
    }
  }
}
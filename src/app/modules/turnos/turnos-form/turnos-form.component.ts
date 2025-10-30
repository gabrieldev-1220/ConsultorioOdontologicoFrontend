import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Turno } from '../../../models/turno.model';
import { Paciente } from '../../../models/paciente.model';
import { Odontologo } from '../../../models/odontologo.model';

@Component({
  selector: 'app-turnos-form',
  standalone:false,
  templateUrl: './turnos-form.component.html',
  styleUrls: ['./turnos-form.component.scss']
})
export class TurnosFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;
  pacientes: Paciente[] = [];
  odontologos: Odontologo[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.fb.group({
      idPaciente: ['', Validators.required],
      idOdontologo: ['', Validators.required],
      fechaHora: ['', Validators.required],
      estado: ['pendiente'],
      observaciones: ['']
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<Turno>(`Turnos/${this.id}`).subscribe(data => this.form.patchValue(data), error => this.toastr.error('Error al cargar turno'));
    }
    this.loadPacientes();
    this.loadOdontologos();
  }

  loadPacientes() {
    this.apiService.get<Paciente[]>('Pacientes').subscribe(data => this.pacientes = data);
  }

  loadOdontologos() {
    this.apiService.get<Odontologo[]>('Odontologos').subscribe(data => this.odontologos = data);
  }

  onSubmit() {
    if (this.id) {
      this.apiService.put<Turno>(`Turnos/${this.id}`, this.form.value).subscribe(() => {
        this.toastr.success('Turno actualizado');
        this.router.navigate(['/turnos']);
      }, error => this.toastr.error('Error al actualizar'));
    } else {
      this.apiService.post<Turno>('Turnos', this.form.value).subscribe(() => {
        this.toastr.success('Turno creado');
        this.router.navigate(['/turnos']);
      }, error => this.toastr.error('Error al crear'));
    }
  }
}
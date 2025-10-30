import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Odontologo } from '../../../models/odontologo.model';

@Component({
  selector: 'app-odontologos-form',
  standalone:false,
  templateUrl: './odontologos-form.component.html',
  styleUrls: ['./odontologos-form.component.scss']
})
export class OdontologosFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      matricula: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,20}$/)]],
      email: [''],
      especialidad: ['']
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<Odontologo>(`Odontologos/${this.id}`).subscribe(data => this.form.patchValue(data), error => this.toastr.error('Error al cargar odontólogo'));
    }
  }

  onSubmit() {
    if (this.id) {
      this.apiService.put<Odontologo>(`Odontologos/${this.id}`, this.form.value).subscribe(() => {
        this.toastr.success('Odontólogo actualizado');
        this.router.navigate(['/odontologos']);
      }, error => this.toastr.error('Error al actualizar'));
    } else {
      this.apiService.post<Odontologo>('Odontologos', this.form.value).subscribe(() => {
        this.toastr.success('Odontólogo creado');
        this.router.navigate(['/odontologos']);
      }, error => this.toastr.error('Error al crear'));
    }
  }
}
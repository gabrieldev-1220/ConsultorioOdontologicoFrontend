import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Tratamiento } from '../../../models/tratamiento.model';

@Component({
  selector: 'app-tratamientos-form',
  standalone:false,
  templateUrl: './tratamientos-form.component.html',
  styleUrls: ['./tratamientos-form.component.scss']
})
export class TratamientosFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, Validators.required]
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<Tratamiento>(`Tratamientos/${this.id}`).subscribe(data => this.form.patchValue(data), error => this.toastr.error('Error al cargar tratamiento'));
    }
  }

  onSubmit() {
    if (this.id) {
      this.apiService.put<Tratamiento>(`Tratamientos/${this.id}`, this.form.value).subscribe(() => {
        this.toastr.success('Tratamiento actualizado');
        this.router.navigate(['/tratamientos']);
      }, error => this.toastr.error('Error al actualizar'));
    } else {
      this.apiService.post<Tratamiento>('Tratamientos', this.form.value).subscribe(() => {
        this.toastr.success('Tratamiento creado');
        this.router.navigate(['/tratamientos']);
      }, error => this.toastr.error('Error al crear'));
    }
  }
}
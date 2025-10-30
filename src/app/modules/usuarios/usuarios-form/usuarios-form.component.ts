import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../models/usuario.model';
import { Odontologo } from '../../../models/odontologo.model';

@Component({
  selector: 'app-usuarios-form',
  standalone:false,
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss']
})
export class UsuariosFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;
  odontologos: Odontologo[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required],
      idOdontologo: [null]
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<Usuario>(`Usuarios/${this.id}`).subscribe(data => {
        this.form.patchValue({ ...data, password: '' }); // No mostrar password existente
      }, error => this.toastr.error('Error al cargar usuario'));
    }
    this.loadOdontologos();
  }

  loadOdontologos() {
    this.apiService.get<Odontologo[]>('Odontologos').subscribe(data => this.odontologos = data);
  }

  onSubmit() {
    if (this.id) {
      this.apiService.put<Usuario>(`Usuarios/${this.id}`, this.form.value).subscribe(() => {
        this.toastr.success('Usuario actualizado');
        this.router.navigate(['/usuarios']);
      }, error => this.toastr.error('Error al actualizar'));
    } else {
      this.apiService.post<Usuario>('Usuarios/register', this.form.value).subscribe(() => {
        this.toastr.success('Usuario creado');
        this.router.navigate(['/usuarios']);
      }, error => this.toastr.error('Error al crear'));
    }
  }
}
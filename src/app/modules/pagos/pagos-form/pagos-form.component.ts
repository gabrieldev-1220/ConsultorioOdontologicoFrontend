import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Pago } from '../../../models/pago.model';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-pagos-form',
  standalone:false,
  templateUrl: './pagos-form.component.html',
  styleUrls: ['./pagos-form.component.scss']
})
export class PagosFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;
  pacientes: Paciente[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.fb.group({
      idPaciente: ['', Validators.required],
      fechaPago: ['', Validators.required],
      monto: [0, Validators.required],
      metodoPago: ['', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<Pago>(`Pagos/${this.id}`).subscribe(data => this.form.patchValue(data), error => this.toastr.error('Error al cargar pago'));
    }
    this.loadPacientes();
  }

  loadPacientes() {
    this.apiService.get<Paciente[]>('Pacientes').subscribe(data => this.pacientes = data);
  }

  onSubmit() {
    if (this.id) {
      this.apiService.put<Pago>(`Pagos/${this.id}`, this.form.value).subscribe(() => {
        this.toastr.success('Pago actualizado');
        this.router.navigate(['/pagos']);
      }, error => this.toastr.error('Error al actualizar'));
    } else {
      this.apiService.post<Pago>('Pagos', this.form.value).subscribe(() => {
        this.toastr.success('Pago creado');
        this.router.navigate(['/pagos']);
      }, error => this.toastr.error('Error al crear'));
    }
  }
}
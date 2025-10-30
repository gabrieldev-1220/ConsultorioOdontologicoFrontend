import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HistorialTratamientos } from '../../../models/historial-tratamientos.model';
import { HistorialClinico } from '../../../models/historial-clinico.model';
import { Tratamiento } from '../../../models/tratamiento.model';

@Component({
  selector: 'app-hist-trat-form',
  standalone:false,
  templateUrl: './hist-trat-form.component.html',
  styleUrls: ['./hist-trat-form.component.scss']
})
export class HistTratFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;
  historiales: HistorialClinico[] = [];
  tratamientos: Tratamiento[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.fb.group({
      idHistorial: ['', Validators.required],
      idTratamiento: ['', Validators.required],
      cantidad: [1, Validators.required],
      precioUnitario: [0, Validators.required]
    });
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.apiService.get<HistorialTratamientos>(`HistorialTratamientos/${this.id}`).subscribe(data => this.form.patchValue(data), error => this.toastr.error('Error al cargar entrada'));
    }
    this.loadHistoriales();
    this.loadTratamientos();
  }

  loadHistoriales() {
    this.apiService.get<HistorialClinico[]>('HistorialClinico').subscribe(data => this.historiales = data);
  }

  loadTratamientos() {
    this.apiService.get<Tratamiento[]>('Tratamientos').subscribe(data => this.tratamientos = data);
  }

  onSubmit() {
    if (this.id) {
      this.apiService.put<HistorialTratamientos>(`HistorialTratamientos/${this.id}`, this.form.value).subscribe(() => {
        this.toastr.success('Entrada actualizada');
        this.router.navigate(['/historial-tratamientos']);
      }, error => this.toastr.error('Error al actualizar'));
    } else {
      this.apiService.post<HistorialTratamientos>('HistorialTratamientos', this.form.value).subscribe(() => {
        this.toastr.success('Entrada creada');
        this.router.navigate(['/historial-tratamientos']);
      }, error => this.toastr.error('Error al crear'));
    }
  }
}
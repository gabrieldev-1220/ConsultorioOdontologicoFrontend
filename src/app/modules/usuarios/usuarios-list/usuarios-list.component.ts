import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone:false,
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.apiService.get<Usuario[]>('Usuarios').subscribe(data => this.usuarios = data, error => this.toastr.error('Error al cargar usuarios'));
  }
}
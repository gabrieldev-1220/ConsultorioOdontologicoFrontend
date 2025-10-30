import { Component, OnInit } from '@angular/core';
import { BitacoraService } from '../../../core/services/bitacora.service';
import { ToastrService } from 'ngx-toastr';
import { Bitacora } from '../../../models/bitacora.model';

@Component({
  selector: 'app-bitacora-list',
  standalone: false,
  templateUrl: './bitacora-list.component.html',
  styleUrls: ['./bitacora-list.component.scss']
})
export class BitacoraListComponent implements OnInit {
  bitacora: Bitacora[] = [];

  constructor(private bitacoraService: BitacoraService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadBitacora();
  }

  loadBitacora() {
    this.bitacoraService.getBitacora().subscribe(data => this.bitacora = data, error => this.toastr.error('Error al cargar bitácora'));
  }
}
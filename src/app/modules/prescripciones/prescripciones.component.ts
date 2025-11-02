import { Component, Input, OnInit } from '@angular/core';

interface Prescripcion {
  fecha: string;
  medicamento: string;
  dosis: string;
  duracion: string;
  estado: 'activa' | 'completada';
}

@Component({
  selector: 'app-prescripciones',
  standalone: false,
  templateUrl: './prescripciones.component.html',
  styleUrl: './prescripciones.component.scss'
})
export class PrescripcionesComponent implements OnInit {
  @Input() pacienteId!: number;
  prescripciones: Prescripcion[] = [];

  ngOnInit() {
    this.prescripciones = [
      { fecha: '2025-10-15', medicamento: 'Ibuprofeno 600mg', dosis: '1 cada 8hs', duracion: '5 días', estado: 'activa' },
      { fecha: '2025-09-20', medicamento: 'Amoxicilina 500mg', dosis: '1 cada 8hs', duracion: '7 días', estado: 'completada' }
    ];
  }
}
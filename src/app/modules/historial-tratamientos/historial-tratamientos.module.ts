import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialTratamientosRoutingModule } from './historial-tratamientos-routing.module';
import { HistTratListComponent } from './hist-trat-list/hist-trat-list.component';
import { HistTratFormComponent } from './hist-trat-form/hist-trat-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [HistTratListComponent, HistTratFormComponent],
  imports: [
    CommonModule,
    HistorialTratamientosRoutingModule,
    SharedModule
  ]
})
export class HistorialTratamientosModule { }
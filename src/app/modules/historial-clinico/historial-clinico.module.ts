import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HistorialClinicoRoutingModule } from './historial-clinico-routing.module';
import { HistorialListComponent } from './historial-list/historial-list.component';
import { HistorialClinicoComponent } from './historial-clinico.component';
import { SharedModule } from '../../shared/shared.module';
import { HistorialClinicoService } from '../../core/services/historial-clinico.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@NgModule({
  declarations: [
    HistorialListComponent,
    HistorialClinicoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HistorialClinicoRoutingModule,
    SharedModule,
    TruncatePipe
  ],
  providers: [
    HistorialClinicoService
  ],
  exports: [
    HistorialClinicoComponent
  ]
})
export class HistorialClinicoModule { }
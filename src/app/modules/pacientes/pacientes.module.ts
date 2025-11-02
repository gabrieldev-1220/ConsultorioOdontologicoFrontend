import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesRoutingModule } from './pacientes-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HistorialClinicoModule } from '../historial-clinico/historial-clinico.module'; // AÑADIDO
import { TruncatePipe } from '../../pipes/truncate.pipe'; // AÑADIDO

// Componentes del módulo de pacientes
import { PacientesListComponent } from './pacientes-list/pacientes-list.component';
import { PacientesFormComponent } from './pacientes-form/pacientes-form.component';
import { PacienteFichaComponent } from './paciente-ficha/paciente-ficha.component';
import { OdontogramComponent } from './odontogram/odontogram.component';
import { PacienteDetailComponent } from './paciente-detail/paciente-detail.component';
import { PresupuestoModule } from '../presupuesto/presupuesto.module';

// Pipe local
import { GroupByPipe } from '../../pipes/group-by.pipe';

@NgModule({
  declarations: [
    PacientesListComponent,
    PacientesFormComponent,
    PacienteFichaComponent,
    OdontogramComponent,
    PacienteDetailComponent,
    GroupByPipe
  ],
  imports: [
    CommonModule,
    PacientesRoutingModule,
    SharedModule,
    HistorialClinicoModule,
    TruncatePipe,
    PresupuestoModule
  ],
  exports: [
    OdontogramComponent,
    PacienteFichaComponent,
    GroupByPipe,
    PacienteDetailComponent
  ]
})
export class PacientesModule { }
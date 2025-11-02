import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacientesListComponent } from './pacientes-list/pacientes-list.component';
import { PacientesFormComponent } from './pacientes-form/pacientes-form.component';
import { PacienteDetailComponent } from './paciente-detail/paciente-detail.component';

const routes: Routes = [
  { path: '', component: PacientesListComponent },
  { path: 'new', component: PacientesFormComponent },
  { path: ':id/edit', component: PacientesFormComponent },
  { path: ':id', component: PacienteDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacientesRoutingModule { }
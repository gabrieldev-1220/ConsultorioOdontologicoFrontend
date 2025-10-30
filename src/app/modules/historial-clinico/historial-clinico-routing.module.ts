import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistorialClinicoComponent } from './historial-clinico.component';
import { HistorialFormComponent } from './historial-form/historial-form.component';

const routes: Routes = [
  { path: '', component: HistorialClinicoComponent },
  { path: ':pacienteId', component: HistorialClinicoComponent },
  { path: ':pacienteId/new', component: HistorialFormComponent },
  { path: ':pacienteId/:id/edit', component: HistorialFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialClinicoRoutingModule { }
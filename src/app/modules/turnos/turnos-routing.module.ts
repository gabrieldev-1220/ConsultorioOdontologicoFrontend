import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosListComponent } from './turnos-list/turnos-list.component';
import { TurnosFormComponent } from './turnos-form/turnos-form.component';

const routes: Routes = [
  { path: '', component: TurnosListComponent },
  { path: 'new', component: TurnosFormComponent },
  { path: ':id/edit', component: TurnosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
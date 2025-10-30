import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistTratListComponent } from './hist-trat-list/hist-trat-list.component';
import { HistTratFormComponent } from './hist-trat-form/hist-trat-form.component';

const routes: Routes = [
  { path: '', component: HistTratListComponent },
  { path: 'new', component: HistTratFormComponent },
  { path: ':id/edit', component: HistTratFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialTratamientosRoutingModule { }
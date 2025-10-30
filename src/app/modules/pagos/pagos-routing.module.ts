import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagosListComponent } from './pagos-list/pagos-list.component';
import { PagosFormComponent } from './pagos-form/pagos-form.component';

const routes: Routes = [
  { path: '', component: PagosListComponent },
  { path: 'new', component: PagosFormComponent },
  { path: ':id/edit', component: PagosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule { }
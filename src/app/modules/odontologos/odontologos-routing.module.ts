import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OdontologosListComponent } from './odontologos-list/odontologos-list.component';
import { OdontologosFormComponent } from './odontologos-form/odontologos-form.component';

const routes: Routes = [
  { path: '', component: OdontologosListComponent },
  { path: 'new', component: OdontologosFormComponent },
  { path: ':id/edit', component: OdontologosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OdontologosRoutingModule { }
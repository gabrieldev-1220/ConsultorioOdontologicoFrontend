import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TratamientosListComponent } from './tratamientos-list/tratamientos-list.component';
import { TratamientosFormComponent } from './tratamientos-form/tratamientos-form.component';

const routes: Routes = [
  { path: '', component: TratamientosListComponent },
  { path: 'new', component: TratamientosFormComponent },
  { path: ':id/edit', component: TratamientosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TratamientosRoutingModule { }
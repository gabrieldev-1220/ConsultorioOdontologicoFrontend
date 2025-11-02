import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TratamientosComponent } from './tratamientos.component';
import { TratamientosFormComponent } from './tratamientos-form/tratamientos-form.component';

const routes: Routes = [
  { path: '', component: TratamientosComponent },
  { path: 'new', component: TratamientosFormComponent },
  { path: ':id/edit', component: TratamientosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TratamientosRoutingModule { }
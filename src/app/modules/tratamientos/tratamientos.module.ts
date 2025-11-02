import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TratamientosRoutingModule } from './tratamientos-routing.module';
import { TratamientosListComponent } from './tratamientos-list/tratamientos-list.component';
import { TratamientosFormComponent } from './tratamientos-form/tratamientos-form.component';
import { SharedModule } from '../../shared/shared.module';

// NUEVO COMPONENTE
import { TratamientosComponent } from './tratamientos.component';

@NgModule({
  declarations: [
    TratamientosListComponent,
    TratamientosFormComponent,
    TratamientosComponent
  ],
  imports: [
    CommonModule,
    TratamientosRoutingModule,
    SharedModule
  ],
  exports: [
    TratamientosComponent
  ]
})
export class TratamientosModule { }
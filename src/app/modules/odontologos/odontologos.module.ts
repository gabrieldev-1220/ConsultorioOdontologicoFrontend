import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OdontologosRoutingModule } from './odontologos-routing.module';
import { OdontologosComponent } from './odontologos.component';
import { OdontologosListComponent } from './odontologos-list/odontologos-list.component';
import { OdontologosFormComponent } from './odontologos-form/odontologos-form.component';


@NgModule({
  declarations: [
    OdontologosComponent,
    OdontologosListComponent,
    OdontologosFormComponent
  ],
  imports: [
    CommonModule,
    OdontologosRoutingModule
  ]
})
export class OdontologosModule { }

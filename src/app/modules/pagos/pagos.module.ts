import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosRoutingModule } from './pagos-routing.module';
import { PagosListComponent } from './pagos-list/pagos-list.component';
import { PagosFormComponent } from './pagos-form/pagos-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PagosListComponent, PagosFormComponent],
  imports: [
    CommonModule,
    PagosRoutingModule,
    SharedModule
  ]
})
export class PagosModule { }
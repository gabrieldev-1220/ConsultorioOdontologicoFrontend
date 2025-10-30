import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacoraListComponent } from './bitacora-list/bitacora-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [BitacoraListComponent],
  imports: [
    CommonModule,
    BitacoraRoutingModule,
    SharedModule
  ]
})
export class BitacoraModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { SharedModule } from '../../shared/shared.module';
import { ReportesListComponent } from './reportes-list/reportes-list.component';

@NgModule({
  declarations: [ReportesComponent, ReportesListComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule
  ]
})
export class ReportesModule { }
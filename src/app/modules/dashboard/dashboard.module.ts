import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent  // Ahora sí se declara porque no es standalone
  ],
  imports: [
    SharedModule,       // Trae CommonModule y FormsModule
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

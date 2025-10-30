import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '', 
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: { redirectTo: '/dashboard' } // Redirigir a /dashboard si autenticado
  },
  { 
    path: 'login', 
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) 
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'pacientes', 
    loadChildren: () => import('./modules/pacientes/pacientes.module').then(m => m.PacientesModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'recepcionista', 'odontologo'] } // Añadido 'odontologo'
  },
  { 
    path: 'odontologos', 
    loadChildren: () => import('./modules/odontologos/odontologos.module').then(m => m.OdontologosModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { 
    path: 'turnos', 
    loadChildren: () => import('./modules/turnos/turnos.module').then(m => m.TurnosModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'recepcionista', 'odontologo'] } 
  },
  { 
    path: 'historial-clinico', 
    loadChildren: () => import('./modules/historial-clinico/historial-clinico.module').then(m => m.HistorialClinicoModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'odontologo'] } 
  },
  { 
    path: 'tratamientos', 
    loadChildren: () => import('./modules/tratamientos/tratamientos.module').then(m => m.TratamientosModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'odontologo'] } // Añadido 'odontologo'
  },
  { 
    path: 'historial-tratamientos', 
    loadChildren: () => import('./modules/historial-tratamientos/historial-tratamientos.module').then(m => m.HistorialTratamientosModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'odontologo'] } 
  },
  { 
    path: 'pagos', 
    loadChildren: () => import('./modules/pagos/pagos.module').then(m => m.PagosModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin', 'recepcionista', 'odontologo'] } // Añadido 'odontologo'
  },
  { 
    path: 'usuarios', 
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { 
    path: 'bitacora', 
    loadChildren: () => import('./modules/bitacora/bitacora.module').then(m => m.BitacoraModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { 
    path: 'reportes', 
    loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule), 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { 
    path: '**', 
    redirectTo: '/login' // Redirigir a /login para rutas no encontradas si no autenticado
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
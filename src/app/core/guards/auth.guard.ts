import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {}

  canActivate(): boolean {
    // Si se encuentra activado el modo desarrollador. permite el acceso directo.
    if (environment.bypassAuth) {
      console.warn('⚠️ Modo desarrollo activado: autenticación deshabilitada');
      return true;
    }

    // Ejecución normal (se requiere estar logueado).
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.toastr.error('Debes iniciar sesión');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
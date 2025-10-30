import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRol = this.authService.getRol();

    if (expectedRoles.includes(userRol)) {
      return true;
    } else {
      this.toastr.error('Acceso denegado: Rol insuficiente');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
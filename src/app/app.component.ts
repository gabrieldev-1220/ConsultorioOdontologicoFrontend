import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Verificar el estado de autenticación al iniciar la aplicación
    if (!this.authService.isLoggedIn() && !environment.bypassAuth) {
      this.router.navigate(['/login']);
    } else if (this.authService.isLoggedIn() && this.router.url === '/login') {
      this.router.navigate(['/dashboard']);
    }
  }

  isDevMode() {
    return environment.bypassAuth;
  }

  isAuthenticated(): boolean {
    return this.isDevMode() || this.authService.isLoggedIn();
  }
}
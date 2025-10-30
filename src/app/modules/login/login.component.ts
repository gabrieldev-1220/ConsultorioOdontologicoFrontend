import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onLogin() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        () => {
          // El mensaje de éxito se maneja en auth.service.ts
        },
        (error) => {
          console.error('Error detallado al iniciar sesión:', error);
          if (error.status === 0) {
            this.toastr.error('No podemos conectarnos al servidor. Verifica tu conexión o contacta al soporte.');
          } else if (error.status === 401) {
            this.toastr.error('Usuario o contraseña incorrectos. Por favor, verifica tus datos.');
          } else if (error.status === 500) {
            this.toastr.error('Ha ocurrido un error en el sistema. Nuestro equipo está trabajando para solucionarlo.');
          } else {
            this.toastr.error('Error desconocido: ' + (error.message || 'Intenta de nuevo'));
          }
        }
      );
    } else {
      this.toastr.error('Por favor, completa todos los campos para continuar.');
    }
  }

  onImageError(event: Event) {
    console.error('Error al cargar la imagen lateral:', (event.target as HTMLImageElement).src);
  }
}
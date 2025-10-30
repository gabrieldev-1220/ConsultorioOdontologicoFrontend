import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'Usuarios';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol || '');
          localStorage.setItem('idOdontologo', response.idOdontologo?.toString() || '');
          localStorage.setItem('fullName', response.fullName || 'Odontólogo Desconocido');
          localStorage.setItem('matricula', response.matricula || 'N/A');
          this.toastr.success('¡Bienvenido a Clínica Odontológica COIN!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Error: respuesta del servidor inválida');
        }
      }),
      catchError(err => {
        console.error('Error al iniciar sesión:', err);
        if (err.status === 0) {
          this.toastr.error('No podemos conectarnos al servidor. Verifica tu conexión o contacta al soporte.');
        } else if (err.status === 401) {
          this.toastr.error('Usuario o contraseña incorrectos. Por favor, verifica tus datos.');
        } else if (err.status === 500) {
          this.toastr.error('Ha ocurrido un error en el sistema. Nuestro equipo está trabajando para solucionarlo.');
        } else {
          this.toastr.error('Error desconocido: ' + (err.message || 'Intenta de nuevo'));
        }
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Forzar recarga para actualizar el estado visual
    });
    this.toastr.info('Has cerrado sesión exitosamente. ¡Hasta pronto!');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRol(): string {
    return localStorage.getItem('rol') || '';
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getFullName(): string {
    return localStorage.getItem('fullName') || '';
  }

  getMatricula(): string {
    return localStorage.getItem('matricula') || '';
  }

  getAvatar(): string | null {
    return localStorage.getItem('avatar') || null;
  }

  getIdOdontologo(): string | null {
    return localStorage.getItem('idOdontologo') || null;
  }
}
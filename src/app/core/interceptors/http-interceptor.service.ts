import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    console.log(`Intercepción de solicitud a ${req.urlWithParams}`);

    return next.handle(authReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse && req.url.includes('Usuarios/login') && event.status === 200) {
          // Evitar que el interceptor muestre errores si el login es exitoso
        }
      }),
      catchError(error => {
        console.error(`Error interceptado en ${req.urlWithParams}:`, error);
        if (error.status === 401) {
          this.toastr.error('Sesión expirada, por favor inicia sesión de nuevo');
          this.authService.logout();
        } else if (error.status === 403) {
          this.toastr.error('No tienes permisos para esta acción');
        } else if (error.status !== 200 && !req.url.includes('Usuarios/login') && !req.headers.has('X-Skip-Interceptor') && !req.url.includes('Turnos/agenda') && !req.url.includes('HistorialClinico')) {
          // Mostrar error solo si no se salta el interceptor y no es Turnos/agenda o HistorialClinico
          this.toastr.error('Error en la solicitud: ' + (error.error?.message || 'Inténtalo de nuevo') + ' (Código: ' + error.status + ')');
        }
        return throwError(() => error);
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private buildParams(paramsObj?: { [key: string]: any }): HttpParams {
    let params = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach(key => {
        const value = paramsObj[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return params;
  }

  get<T>(endpoint: string, paramsObj?: { [key: string]: any }, handleErrorLocally: boolean = false): Observable<T> {
    const params = this.buildParams(paramsObj);
    console.log(`Realizando GET a ${this.apiUrl}${endpoint} con params:`, paramsObj);
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers: this.getHeaders(), params }).pipe(
      catchError(error => {
        console.error(`Error en GET ${endpoint}:`, error);
        if (!handleErrorLocally) throw error;
        return throwError(() => error);
      })
    );
  }

  post<T>(endpoint: string, data: any, paramsObj?: { [key: string]: any }): Observable<T> {
    const params = this.buildParams(paramsObj);
    console.log(`Realizando POST a ${this.apiUrl}${endpoint} con datos:`, data, 'y params:', paramsObj);
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, { headers: this.getHeaders(), params }).pipe(
      catchError(error => {
        console.error(`Error en POST ${endpoint}:`, error);
        return throwError(() => error);
      })
    );
  }

  put<T>(endpoint: string, data: any, paramsObj?: { [key: string]: any }): Observable<T> {
    const params = this.buildParams(paramsObj);
    console.log(`Realizando PUT a ${this.apiUrl}${endpoint} con datos:`, data, 'y params:', paramsObj);
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, { headers: this.getHeaders(), params }).pipe(
      catchError(error => {
        console.error(`Error en PUT ${endpoint}:`, error);
        return throwError(() => error);
      })
    );
  }

  delete<T>(endpoint: string, paramsObj?: { [key: string]: any }): Observable<T> {
    const params = this.buildParams(paramsObj);
    console.log(`Realizando DELETE a ${this.apiUrl}${endpoint} con params:`, paramsObj);
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers: this.getHeaders(), params }).pipe(
      catchError(error => {
        console.error(`Error en DELETE ${endpoint}:`, error);
        return throwError(() => error);
      })
    );
  }
}
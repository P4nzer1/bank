import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/authorization/token'; // URL для авторизации

  constructor(private http: HttpClient) {}

  login(credentials: { login: string, password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }

  // Метод для сохранения токена в localStorage
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // Метод для получения токена
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Метод для удаления токена (используется при выходе из системы)
  logout(): void {
    localStorage.removeItem('accessToken');
  }
}

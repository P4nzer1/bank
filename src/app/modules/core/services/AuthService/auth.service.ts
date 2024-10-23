import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken(); 
    return of(!!token); 
  }
  login(credentials: { login: string; password: string }): Observable<any> {
    return this.http.post('api/authorization/token', credentials);
  }

  
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post('api/authorization/refresh', { token: refreshToken });
  }

  
  logout(): Observable<any> {
    return this.http.delete('api/authorization/logout');
  }

  
  register(registrationData: any): Observable<any> {
    return this.http.put('api/clients', registrationData);
  }

  
  getClient(): Observable<any> {
    return this.http.get('api/clients');
  }

  updateClient(clientData: any): Observable<any> {
    return this.http.patch('api/clients', clientData);
  }

  deleteClient(): Observable<any> {
    return this.http.delete('api/clients');
  }

  updatePassword(login: string): Observable<any> {
    return this.http.patch('api/clients/password', { login });
  }


  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    const token = localStorage.getItem('accessToken');
    return token;
  }

  removeToken(): void {
    localStorage.removeItem('accessToken');
  }
}



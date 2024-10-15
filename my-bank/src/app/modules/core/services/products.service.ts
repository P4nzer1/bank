import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = 'https://fw-ib-7fc99.psb-tech.ru/api'; 

  constructor(private http: HttpClient) {}

  getCards(): Observable<any[]> {
    return this.http.get<any[]>('/api/cards');
  }

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>('/api/accounts');
  }

  getAccountById(accountId: string): Observable<any> {
    return this.http.get<any>(`/api/accounts/${accountId}`);
  }

  getCardById(cardId: string): Observable<any> {
    return this.http.get<any>(`/api/cards/${cardId}`);
  }

  lockAccount(accountId: string): Observable<any> {
    return this.http.patch<any>(`/api/accounts/lock/${accountId}`, {});
  }

  unlockAccount(accountId: string): Observable<any> {
    return this.http.patch<any>(`/api/accounts/unlock/${accountId}`, {});
  }

  lockCard(cardId: string): Observable<any> {
    return this.http.patch<any>(`/api/cards/lock/${cardId}`, {});
  }

  unlockCard(cardId: string): Observable<any> {
    return this.http.patch<any>(`/api/cards/unlock/${cardId}`, {});
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>('/api/cards/orders');
  }

  activateCard(cardId: string): Observable<any> {
    return this.http.patch<any>(`/api/cards/activate/${cardId}`, {});
  }
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  removeToken(): void {
    localStorage.removeItem('accessToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Если токен есть, возвращаем true
  }
}



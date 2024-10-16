import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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
  
}



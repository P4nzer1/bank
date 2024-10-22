import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Card } from '../../interface/Card';
import { Account } from '../../interface/Account'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private accountsSubject = new BehaviorSubject<any[]>([]); 
  accounts$ = this.accountsSubject.asObservable(); 

  constructor(private http: HttpClient, private router: Router) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>('/api/cards').pipe(
      map(cards => cards.map(card => ({ ...card, cardId: card.id || card.cardId }))) 
    );
  }
  
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>('/api/accounts').pipe(
      map(accounts => accounts.map(account => ({ ...account, accountId: account.id || account.accountId }))) 
    );
  }
  
  updateAccounts(accounts: any[]) {
    this.accountsSubject.next(accounts); 
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

  openAccount() {
    this.router.navigate(['/operations/open']);
  }

  orderCard() {
    this.router.navigate(['/operations/order']);
  }

  refillAccount(accountNumber: string) {
    this.router.navigate(['/operations/refill'], { queryParams: { accountNumber } });
  }

  transferMoney(cardNumber: string) {
    this.router.navigate(['/operations/transfer'], { queryParams: { cardNumber } });
  }
}



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
  

  private accountsSubject = new BehaviorSubject<any[]>([]); // Создаем BehaviorSubject для счетов
  accounts$ = this.accountsSubject.asObservable(); // Экспортируем как Observable

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
  
  
  // Обновление информации о счетах
  updateAccounts(accounts: any[]) {
    this.accountsSubject.next(accounts); 
  }

  // Получение счета по ID
  getAccountById(accountId: string): Observable<any> {
    return this.http.get<any>(`/api/accounts/${accountId}`);
  }

  // Получение карты по ID
  getCardById(cardId: string): Observable<any> {
    return this.http.get<any>(`/api/cards/${cardId}`);
  }

  // Блокировка счета
  lockAccount(accountId: string): Observable<any> {
    return this.http.patch<any>(`/api/accounts/lock/${accountId}`, {});
  }

  // Разблокировка счета
  unlockAccount(accountId: string): Observable<any> {
    return this.http.patch<any>(`/api/accounts/unlock/${accountId}`, {});
  }

  // Блокировка карты
  lockCard(cardId: string): Observable<any> {
    return this.http.patch<any>(`/api/cards/lock/${cardId}`, {});
  }

  // Разблокировка карты
  unlockCard(cardId: string): Observable<any> {
    return this.http.patch<any>(`/api/cards/unlock/${cardId}`, {});
  }

  // Получение заказов на карты
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>('/api/cards/orders');
  }

  // Активация карты
  activateCard(cardId: string): Observable<any> {
    return this.http.patch<any>(`/api/cards/activate/${cardId}`, {});
  }

  // Навигация: открыть счет
  openAccount() {
    this.router.navigate(['/operations/open']);
  }

  // Навигация: заказать карту
  orderCard() {
    this.router.navigate(['/operations/order']);
  }

  // Навигация: пополнить счет
  refillAccount(accountNumber: string) {
    this.router.navigate(['/operations/refill'], { queryParams: { accountNumber } });
  }

  // Навигация: перевести деньги на карту
  transferMoney(cardNumber: string) {
    this.router.navigate(['/operations/transfer'], { queryParams: { cardNumber } });
  }
}



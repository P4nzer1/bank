import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private accountsUrl = '/api/accounts';  // URL для получения счетов
  private cardsUrl = '/api/cards';        // URL для получения карт

  constructor(private http: HttpClient) {}

  // Метод для получения счетов клиента
  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.accountsUrl);
  }

  // Метод для получения карт клиента
  getCards(): Observable<any[]> {
    return this.http.get<any[]>(this.cardsUrl);
  }
}

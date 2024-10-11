import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private accountsUrl = '/api/accounts'; // URL для получения счетов
  private cardsUrl = '/api/cards';       // URL для получения карт

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.accountsUrl).pipe(
      catchError((error) => {
        console.error('Ошибка при получении счетов:', error);
        return throwError(() => error);
      })
    );
  }

  getCards(): Observable<any[]> {
    return this.http.get<any[]>(this.cardsUrl).pipe(
      catchError((error) => {
        console.error('Ошибка при получении карт:', error);
        return throwError(() => error);
      })
    );
  }
}

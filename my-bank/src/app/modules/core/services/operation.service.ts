import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private baseUrl = 'https://api.example.com/operations';

  constructor(private http: HttpClient) {}

  // Метод для открытия счета
  openAccount(accountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/open`, accountData);
  }

  // Метод для заказа карты
  orderCard(cardData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/card/order`, cardData);
  }

  // Метод для пополнения счета
  refillAccount(refillData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/refill`, refillData);
  }

  // Метод для перевода средств
  transferFunds(transferData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/transfer`, transferData);
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  getCards(): Observable<any> {
    return this.http.get('/api/cards');
  }

  getCvc(cardId: string): Observable<any> {
    return this.http.get(`/api/cards/${cardId}/cvc`);
  }

  getCardOrders(): Observable<any> {
    return this.http.get('/api/cards/orders');
  }

  activateCard(cardId: string, pinCode: string): Observable<any> {
    return this.http.patch(`/api/cards/activate/${cardId}`, { pinCode });
  }
  

  lockCard(cardId: string): Observable<any> {
    return this.http.patch(`/api/cards/lock/${cardId}`, {});
  }

  unlockCard(cardId: string): Observable<any> {
    return this.http.patch(`/api/cards/unlock/${cardId}`, {});
  }
  
}

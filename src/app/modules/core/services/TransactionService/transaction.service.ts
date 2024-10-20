import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<any> {
    return this.http.get('/api/transactions');
  }

  getTransactionsByAccount(accountId: string): Observable<any> {
    return this.http.get(`/api/transactions/byAccount/${accountId}`);
  }
  
  getTransactionInfo(transactionId: string): Observable<any> {
    return this.http.get(`/api/transactions/info/${transactionId}`);
  }
  

}

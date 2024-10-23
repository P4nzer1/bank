import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private baseUrl = 'api/operations'; 

  constructor(private http: HttpClient) {}


  startOperation(operationCode: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`, { operationCode });
  }
  
  
  proceedOperation(requestId: string, stepData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}?requestId=${requestId}`, stepData);
  }
  
  confirmOperation(requestId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?requestId=${requestId}`,{});

  }
  
  deleteOperation(operationId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${operationId}`);
  }
  
  getOperations(): Observable<any> {
    return this.http.get<any>('/api/accounts');
  }  
}




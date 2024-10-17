import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private baseUrl = 'api/operations'; 

  constructor(private http: HttpClient) {}

  
  startOperation(operationData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`, operationData);
  }

  
  proceedOperation(requestId: string, stepData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<any>(`${this.baseUrl}?requestId=${requestId}`, stepData, { headers });
  }

  
  confirmOperation(operationId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${operationId}/confirm`, {});
  }

  
  deleteOperation(operationId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${operationId}`);
  }

  getOperations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}




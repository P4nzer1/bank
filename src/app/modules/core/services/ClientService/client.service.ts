import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  registerClient(clientData: any): Observable<any> {
    return this.http.put('/api/clients', clientData);
  }

  getClient(): Observable<any> {
    return this.http.get('/api/clients');
  }

  updateClient(clientData: any): Observable<any> {
    return this.http.patch('/api/clients', clientData);
  }

  deleteClient(): Observable<any> {
    return this.http.delete('/api/clients');
  }
  
  updatePassword(newPasswordData: { password: string }): Observable<any> {
    return this.http.patch('/api/clients/password', newPasswordData);
  }
  
  
  
  
}

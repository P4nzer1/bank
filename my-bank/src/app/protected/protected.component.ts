import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-protected',
  template: `
    <button (click)="fetchData()">Получить данные</button>
    <div *ngIf="data">{{ data }}</div>
  `
})
export class ProtectedComponent {
  data: any;

  constructor(private http: HttpClient) {}

  fetchData() {
    this.http.get('/api/protected-endpoint').subscribe({
      next: (response) => {
        console.log('Успешный ответ:', response);
        this.data = response;
      },
      error: (err) => {
        console.error('Ошибка:', err);
      }
    });
  }
}

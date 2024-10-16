import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  accounts$: Observable<any[]> | null = null; // Используем Observable для счетов
  cards$: Observable<any[]> | null = null; // Observable для карт
  loadingAccounts: boolean = true;
  loadingCards: boolean = true;
  errorMessage: string = '';

  private unsubscribe$ = new Subject<void>(); // Для отписки от Observable

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCards();
  }

  loadAccounts() {
    // Подписываемся на обновления данных счетов
    this.accounts$ = this.productService.accounts$.pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errorMessage = 'Ошибка при получении счетов';
        console.error('Ошибка при получении счетов:', err);
        this.loadingAccounts = false;
        return [];
      })
    );
    this.loadingAccounts = false;
  }

  loadCards() {
    // Получаем карты клиента
    this.cards$ = this.productService.getCards().pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errorMessage = 'Ошибка при получении карт';
        console.error('Ошибка при получении карт:', err);
        this.loadingCards = false;
        return [];
      })
    );
    this.loadingCards = false;
  }

  ngOnDestroy() {
    // Отписываемся от всех Observable при уничтожении компонента
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}


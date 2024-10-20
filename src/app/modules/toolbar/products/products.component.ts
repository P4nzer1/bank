import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { Account } from '../../core/interface/Account';
import { Card } from '../../core/interface/Card';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  accounts$: Observable<Account[]> | null = null; 
  cards$: Observable<Card[]> | null = null; 
  loadingAccounts: boolean = true;
  loadingCards: boolean = true;
  errorMessage: string = '';

  private unsubscribe$ = new Subject<void>();

  constructor(private productService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCards();
  }

  loadAccounts() {
    this.accounts$ = this.productService.getAccounts().pipe(
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
  onOpenAccount() {
    this.productService.openAccount();
  }
  onOrderCard() {
    this.productService.orderCard();
  }
  onRefillAccount(account: any) {
    this.productService.refillAccount(account.name);
  }
  onTransferMoney(card: any) {
    this.productService.transferMoney(card.number);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

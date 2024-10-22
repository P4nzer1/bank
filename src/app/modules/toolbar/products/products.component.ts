import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { CardService } from '../../core/services/CardService/card.service';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { Account } from '../../core/interface/Account';
import { Card } from '../../core/interface/Card';
import { Currency } from '../../core/interface/currency';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy {
  accounts$: Observable<Account[]> | null = null; 
  cards$: Observable<Card[]> | null = null; 
  loadingAccounts: boolean = true;
  loadingCards: boolean = true;
  errorMessage: string = '';
  cvcCodes: { [cardId: string]: string | null } = {};
  cardStatus: { [cardId: string]: { locked: boolean } } = {}; 

  private unsubscribe$ = new Subject<void>();

  constructor(
    private productService: ProductsService,
    private router: Router,
    private cardService: CardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCards();
  }

  loadAccounts() {
    this.loadingAccounts = true;
    this.accounts$ = this.productService.getAccounts().pipe(
      map(accounts => accounts.filter(account => account.hasOwnProperty('accountId'))),
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errorMessage = 'Ошибка при получении счетов';
        console.error('Ошибка при получении счетов:', err);
        this.loadingAccounts = false;
        this.cd.markForCheck();
        return of([]); 
      })
    );
    this.accounts$.subscribe(() => {
      this.loadingAccounts = false;
      this.cd.markForCheck();
    });
  }

  loadCards() {
    this.loadingCards = true;
    this.cards$ = this.productService.getCards().pipe(
      map(cards => {
        cards.forEach(card => {
          this.cardStatus[card.cardId] = { locked: false };
        });
        return cards;
      }),
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errorMessage = 'Ошибка при получении карт';
        console.error('Ошибка при получении карт:', err);
        this.loadingCards = false;
        this.cd.markForCheck();
        return of([]);
      })
    );
    this.cards$.subscribe(() => {
      this.loadingCards = false;
      this.cd.markForCheck();
    });
  }

  showCvc(cardId: string) {
    this.cardService.getCvc(cardId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (cvc) => {
        this.cvcCodes[cardId] = cvc; 
        this.cd.markForCheck(); 
      },
      (error) => {
        console.error('Ошибка при получении CVC:', error);
        this.cvcCodes[cardId] = 'Ошибка'; 
        this.cd.markForCheck();
      }
    );
  }

  lockCard(cardId: string) {
    this.cardService.lockCard(cardId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => {
        console.log(`Карта ${cardId} заблокирована`);
        this.cardStatus[cardId].locked = true; 
        this.cd.markForCheck();
      },
      (error) => console.error('Ошибка при блокировке карты:', error)
    );
  }

  unlockCard(cardId: string) {
    this.cardService.unlockCard(cardId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => {
        console.log(`Карта ${cardId} разблокирована`);
        this.cardStatus[cardId].locked = false; 
        this.cd.markForCheck();
      },
      (error) => console.error('Ошибка при разблокировке карты:', error)
    );
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

  getCurrencySymbol(currencyCode: Currency | string | undefined): string {
    if (!currencyCode) return ''; 
  
    switch (currencyCode) {
      case Currency.USD:
      case 'USD':
        return '$';
      case Currency.EUR:
      case 'EUR':
        return '€';
      case Currency.RUB:
      case 'RUB':
        return '₽';
      case Currency.CNY:
      case 'CNY':
        return '¥';
      default:
        return currencyCode;
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductsComponent } from './products.component';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { CardService } from '../../core/services/CardService/card.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Account } from '../../core/interface/Account';
import { Card } from '../../core/interface/Card';
import { Currency } from '../../core/interface/currency';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductsService', ['getAccounts', 'getCards', 'openAccount', 'orderCard', 'refillAccount', 'transferMoney']);
    const cardSpy = jasmine.createSpyObj('CardService', ['getCvc', 'lockCard', 'unlockCard']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productSpy },
        { provide: CardService, useValue: cardSpy },
        { provide: Router, useValue: routerMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    changeDetectorRefSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    productServiceSpy.getAccounts.and.returnValue(of([]));
    productServiceSpy.getCards.and.returnValue(of([]));
  });

  it('должен создать компонент', () => {
    expect(component).toBeTruthy();
  });

  it('должен загружать счета при инициализации', () => {
    const mockAccounts: Account[] = [{ id: '1', accountId: '1', balance: 1000, name: 'Savings', number: 1, currency: Currency.RUB }];
    productServiceSpy.getAccounts.and.returnValue(of(mockAccounts));

    component.ngOnInit();

    expect(productServiceSpy.getAccounts).toHaveBeenCalled();
    component.accounts$?.subscribe(accounts => {
      expect(accounts).toEqual(mockAccounts);
    });
  });

  it('должен обрабатывать ошибку при загрузке счетов', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    productServiceSpy.getAccounts.and.returnValue(throwError('Ошибка сервера'));

    component.loadAccounts();

    expect(productServiceSpy.getAccounts).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Ошибка при получении счетов');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Ошибка при получении счетов:', 'Ошибка сервера');
    expect(component.loadingAccounts).toBe(false);
  });

  it('должен загружать карты при инициализации', () => {
    const mockCards: Card[] = [{ id: '1', cardId: '1', number: '1234567890123456', limit: 1000, balance: 100, currency: Currency.RUB }];
    productServiceSpy.getCards.and.returnValue(of(mockCards));

    component.ngOnInit();

    expect(productServiceSpy.getCards).toHaveBeenCalled();
    component.cards$?.subscribe(cards => {
      expect(cards).toEqual(mockCards);
    });
  });

  it('должен обрабатывать ошибку при загрузке карт', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    productServiceSpy.getCards.and.returnValue(throwError('Ошибка сервера'));

    component.loadCards();

    expect(productServiceSpy.getCards).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Ошибка при получении карт');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Ошибка при получении карт:', 'Ошибка сервера');
    expect(component.loadingCards).toBe(false);
  });

  it('должен показывать CVC карты', () => {
    const cardId = '1';
    cardServiceSpy.getCvc.and.returnValue(of('123'));

    component.showCvc(cardId);

    expect(cardServiceSpy.getCvc).toHaveBeenCalledWith(cardId);
    expect(component.cvcCodes[cardId]).toBe('123');
  });

  it('должен обрабатывать ошибку при получении CVC карты', () => {
    const cardId = '1';
    cardServiceSpy.getCvc.and.returnValue(throwError('Ошибка'));

    component.showCvc(cardId);

    expect(cardServiceSpy.getCvc).toHaveBeenCalledWith(cardId);
    expect(component.cvcCodes[cardId]).toBe('Ошибка');
  });

  it('должен блокировать карту', () => {
    const cardId = '1';
    component.cardStatus[cardId] = { locked: false };
    cardServiceSpy.lockCard.and.returnValue(of({}));

    component.lockCard(cardId);

    expect(cardServiceSpy.lockCard).toHaveBeenCalledWith(cardId);
    expect(component.cardStatus[cardId].locked).toBe(true);
  });

  it('должен разблокировать карту', () => {
    const cardId = '1';
    component.cardStatus[cardId] = { locked: true };
    cardServiceSpy.unlockCard.and.returnValue(of({}));

    component.unlockCard(cardId);

    expect(cardServiceSpy.unlockCard).toHaveBeenCalledWith(cardId);
    expect(component.cardStatus[cardId].locked).toBe(false);
  });

  it('должен вызывать service для открытия счета', () => {
    component.onOpenAccount();
    expect(productServiceSpy.openAccount).toHaveBeenCalled();
  });

  it('должен вызывать service для заказа карты', () => {
    component.onOrderCard();
    expect(productServiceSpy.orderCard).toHaveBeenCalled();
  });

  it('должен вызывать service для пополнения счета', () => {
    const account = { name: 'accountName' };
    component.onRefillAccount(account);
    expect(productServiceSpy.refillAccount).toHaveBeenCalledWith(account.name);
  });

  it('должен вызывать service для перевода денег', () => {
    const card = { number: '1234567890123456' };
    component.onTransferMoney(card);
    expect(productServiceSpy.transferMoney).toHaveBeenCalledWith(card.number);
  });

  it('должен возвращать символ валюты', () => {
    expect(component.getCurrencySymbol(Currency.USD)).toBe('$');
    expect(component.getCurrencySymbol(Currency.EUR)).toBe('€');
    expect(component.getCurrencySymbol(Currency.RUB)).toBe('₽');
    expect(component.getCurrencySymbol(Currency.CNY)).toBe('¥');
    expect(component.getCurrencySymbol('unknown')).toBe('unknown');
  });
});

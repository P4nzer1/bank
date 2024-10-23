import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { Card } from '../../interface/Card';
import { Account } from '../../interface/Account';
import { Currency } from '../../interface/currency';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен получать карты через getCards()', () => {
    const mockCards: Card[] = [
      { id: '1', cardId: '1', number: '1111', balance: 1000, limit: 5000, currency: Currency.RUB }
    ];

    service.getCards().subscribe(cards => {
      expect(cards.length).toBe(1);
      expect(cards[0].cardId).toBe('1'); 
    });

    const req = httpMock.expectOne('/api/cards');
    expect(req.request.method).toBe('GET');
    req.flush(mockCards);
  });

  it('должен получать счета через getAccounts()', () => {
    const mockAccounts: Account[] = [
      { id: '1', accountId: '1', number: 12345, name: '1', balance: 10000, currency: Currency.RUB }
    ];

    service.getAccounts().subscribe(accounts => {
      expect(accounts.length).toBe(1);
      expect(accounts[0].accountId).toBe('1'); 
    });

    const req = httpMock.expectOne('/api/accounts');
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);
  });

  it('должен обновлять счета через updateAccounts()', () => {
    const accounts = [{ accountId: '123', balance: 5000 }];
    
    service.updateAccounts(accounts);
    
    service.accounts$.subscribe(updatedAccounts => {
      expect(updatedAccounts).toEqual(accounts);
    });
  });

  it('должен получать информацию о счете через getAccountById()', () => {
    const mockAccount = { accountId: '123', balance: 5000 };

    service.getAccountById('123').subscribe(account => {
      expect(account).toEqual(mockAccount);
    });

    const req = httpMock.expectOne('/api/accounts/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockAccount);
  });

  it('должен блокировать счет через lockAccount()', () => {
    service.lockAccount('123').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/accounts/lock/123');
    expect(req.request.method).toBe('PATCH');
    req.flush({ success: true });
  });

  it('должен разблокировать счет через unlockAccount()', () => {
    service.unlockAccount('123').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/accounts/unlock/123');
    expect(req.request.method).toBe('PATCH');
    req.flush({ success: true });
  });

  it('должен блокировать карту через lockCard()', () => {
    service.lockCard('456').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/cards/lock/456');
    expect(req.request.method).toBe('PATCH');
    req.flush({ success: true });
  });

  it('должен разблокировать карту через unlockCard()', () => {
    service.unlockCard('456').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/cards/unlock/456');
    expect(req.request.method).toBe('PATCH');
    req.flush({ success: true });
  });

  it('должен перенаправить на страницу открытия счета через openAccount()', () => {
    service.openAccount();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/operations/open']);
  });

  it('должен перенаправить на страницу заказа карты через orderCard()', () => {
    service.orderCard();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/operations/order']);
  });

  it('должен перенаправить на страницу пополнения счета через refillAccount()', () => {
    service.refillAccount('12345');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/operations/refill'], { queryParams: { accountNumber: '12345' } });
  });

  it('должен перенаправить на страницу перевода денег через transferMoney()', () => {
    service.transferMoney('1111');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/operations/transfer'], { queryParams: { cardNumber: '1111' } });
  });
});

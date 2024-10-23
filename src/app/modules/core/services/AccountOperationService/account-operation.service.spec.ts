import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AccountOperationService } from './account-operation.service';
import { ProductsService } from '../ProductService/products.service';
import { OperationService } from '../OperationService/operation.service';
import { Currency } from '../../interface/currency';

describe('AccountOperationService', () => {
  let service: AccountOperationService;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let operationServiceSpy: jasmine.SpyObj<OperationService>;

  beforeEach(() => {
    const productsSpy = jasmine.createSpyObj('ProductsService', ['getAccounts', 'getCards']);
    const operationSpy = jasmine.createSpyObj('OperationService', ['startOperation', 'proceedOperation', 'confirmOperation']);

    TestBed.configureTestingModule({
      providers: [
        AccountOperationService,
        { provide: ProductsService, useValue: productsSpy },
        { provide: OperationService, useValue: operationSpy }
      ]
    });

    service = TestBed.inject(AccountOperationService);
    productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    operationServiceSpy = TestBed.inject(OperationService) as jasmine.SpyObj<OperationService>;
  });

  it('должен получать счета пользователя', (done) => {
    const mockAccounts = [
      { accountId: '1', id: '1', number: 12345, balance: 100, name: 'Savings', currency: Currency.RUB }
    ];
    
    productsServiceSpy.getAccounts.and.returnValue(of(mockAccounts));

    service.getUserAccounts().subscribe(accounts => {
      expect(accounts).toEqual(mockAccounts);
      done();
    });

    expect(productsServiceSpy.getAccounts).toHaveBeenCalled();
  });

  it('должен получать карты пользователя', (done) => {
    const mockCards = [
      { cardId: '1', id: '1', number: '54321', balance: 1, limit: 1000, currency: Currency.RUB }
    ];
    
    productsServiceSpy.getCards.and.returnValue(of(mockCards));

    service.getUserCards().subscribe(cards => {
      expect(cards).toEqual(mockCards);
      done();
    });

    expect(productsServiceSpy.getCards).toHaveBeenCalled();
  });

  it('должен запускать операцию пополнения счета и передавать данные', (done) => {
    const mockResponse = { requestId: '12345' };
    const mockOperationResult = { success: true };
    operationServiceSpy.startOperation.and.returnValue(of(mockResponse));
    operationServiceSpy.proceedOperation.and.returnValue(of(mockOperationResult));

    service.refillAccount('12345', 100).subscribe(result => {
      expect(result).toEqual(mockOperationResult);
      expect(operationServiceSpy.startOperation).toHaveBeenCalledWith('AccountRefill');
      expect(operationServiceSpy.proceedOperation).toHaveBeenCalledWith('12345', {
        parameters: [
          { identifier: 'accountNumber', value: '12345' },
          { identifier: 'amount', value: 100 }
        ]
      });
      done();
    });
  });

  it('должен выбрасывать ошибку, если requestId отсутствует при пополнении счета', (done) => {
    operationServiceSpy.startOperation.and.returnValue(of({}));

    service.refillAccount('12345', 100).subscribe({
      next: () => fail('Ожидается ошибка'),
      error: (error) => {
        expect(error.message).toBe('Request ID не получен');
        done();
      }
    });
  });

  it('должен запускать операцию открытия счета', (done) => {
    const mockResponse = { requestId: '12345' };
    const mockOperationResult = { success: true };
    operationServiceSpy.startOperation.and.returnValue(of(mockResponse));
    operationServiceSpy.proceedOperation.and.returnValue(of(mockOperationResult));

    service.openAccount('Savings', 500).subscribe(result => {
      expect(result).toEqual(mockOperationResult);
      expect(operationServiceSpy.startOperation).toHaveBeenCalledWith('AccountOpen');
      expect(operationServiceSpy.proceedOperation).toHaveBeenCalledWith('12345', {
        parameters: [
          { identifier: 'AccountType', value: 'Savings' },
          { identifier: 'InitialBalance', value: '500' }
        ]
      });
      done();
    });
  });

  it('должен запускать операцию перевода между счетами', (done) => {
    const mockResponse = { requestId: '12345' };
    const mockOperationResult = { success: true };
    operationServiceSpy.startOperation.and.returnValue(of(mockResponse));
    operationServiceSpy.proceedOperation.and.returnValue(of(mockOperationResult));

    service.transferBetweenAccounts('account1', 'account2', 200).subscribe(result => {
      expect(result).toEqual(mockOperationResult);
      expect(operationServiceSpy.startOperation).toHaveBeenCalledWith('AccountTransfer');
      expect(operationServiceSpy.proceedOperation).toHaveBeenCalledWith('12345', {
        parameters: [
          { identifier: 'fromAccount', value: 'account1' },
          { identifier: 'toAccount', value: 'account2' },
          { identifier: 'amount', value: 200 }
        ]
      });
      done();
    });
  });

  it('должен подтверждать операцию', (done) => {
    const mockOperationResult = { success: true };
    operationServiceSpy.confirmOperation.and.returnValue(of(mockOperationResult));

    service.confirmOperation('12345').subscribe(result => {
      expect(result).toEqual(mockOperationResult);
      expect(operationServiceSpy.confirmOperation).toHaveBeenCalledWith('12345');
      done();
    });
  });
});

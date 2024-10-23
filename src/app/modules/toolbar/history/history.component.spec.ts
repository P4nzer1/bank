import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HistoryComponent } from './history.component';
import { TransactionService } from '../../core/services/TransactionService/transaction.service';
import { OperationService } from '../../core/services/OperationService/operation.service';
import { Currency } from '../../core/interface/currency';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let operationServiceSpy: jasmine.SpyObj<OperationService>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;

  beforeEach(async () => {
    const operationSpy = jasmine.createSpyObj('OperationService', ['getOperations']);
    const transactionSpy = jasmine.createSpyObj('TransactionService', ['getTransactions']);

    await TestBed.configureTestingModule({
      declarations: [HistoryComponent],
      providers: [
        { provide: OperationService, useValue: operationSpy },
        { provide: TransactionService, useValue: transactionSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    operationServiceSpy = TestBed.inject(OperationService) as jasmine.SpyObj<OperationService>;
    transactionServiceSpy = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
  });

  it('должен создать компонент', () => {
    expect(component).toBeTruthy();
  });

  it('должен получить данные операций при инициализации', () => {
    const mockOperations = [
      { type: 'Пополнение', date: '2024-10-01', amount: 100, currency: Currency.USD },
      { type: 'Снятие', date: '2024-10-02', amount: 200, currency: Currency.RUB },
    ];

    operationServiceSpy.getOperations.and.returnValue(of(mockOperations));

    component.ngOnInit();

    expect(operationServiceSpy.getOperations).toHaveBeenCalled();
    expect(component.operationHistory).toEqual(mockOperations);
  });

  it('должен обработать ошибку при получении данных операций', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    operationServiceSpy.getOperations.and.returnValue(throwError('Ошибка сервера'));

    component.ngOnInit();

    expect(operationServiceSpy.getOperations).toHaveBeenCalled();
    expect(component.operationHistory).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Ошибка при получении данных об операциях:', 'Ошибка сервера');
  });

  it('должен возвращать правильные символы валют', () => {
    expect(component.getCurrencySymbol(Currency.USD)).toBe('$');
    expect(component.getCurrencySymbol(Currency.EUR)).toBe('€');
    expect(component.getCurrencySymbol(Currency.RUB)).toBe('₽');
    expect(component.getCurrencySymbol(Currency.CNY)).toBe('¥');
    expect(component.getCurrencySymbol(999)).toBe(''); 
  });
});

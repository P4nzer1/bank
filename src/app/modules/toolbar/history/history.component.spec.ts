import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HistoryComponent } from './history.component';
import { TransactionService } from '../../core/services/TransactionService/transaction.service';
import { OperationService } from '../../core/services/OperationService/operation.service';
import { Currency } from '../../core/interface/currency';
import { Transaction } from '../../core/interface/transaction';
import { Operation } from '../../core/interface/operation';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockOperationService: jasmine.SpyObj<OperationService>;

  const mockOperations: Operation[] = [
    { type: '1', name: 'Текущий счет', createdDate: '2024-10-18T14:28:00Z', balance: 12302313, currency: Currency.RUB, comment: '' },
    { type: '2', name: 'Накопительный счет', createdDate: '2024-10-18T23:48:00Z', balance: 10000, currency: Currency.RUB, comment: '' }
  ];

  const mockTransactions: Transaction[] = [
    {createdDate: '2024-10-23T14:56:00Z', amount: 12312313, currency: Currency.RUB, type: 'Income', comment: 'Системное пополнение счёта' },
    { createdDate: '2024-10-23T14:56:00Z', amount: 10000, currency: Currency.RUB, type: 'Expense', comment: '' }
  ];

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getTransactions']);
    mockOperationService = jasmine.createSpyObj('OperationService', ['getOperations']);

    await TestBed.configureTestingModule({
      declarations: [HistoryComponent],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: OperationService, useValue: mockOperationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch operations and transactions on init', () => {

    mockOperationService.getOperations.and.returnValue(of(mockOperations));
    mockTransactionService.getTransactions.and.returnValue(of(mockTransactions));

    component.ngOnInit();
    expect(component.combinedHistory.length).toBe(4);
  });

  it('should correctly combine transactions and operations', () => {
    mockOperationService.getOperations.and.returnValue(of(mockOperations));
    mockTransactionService.getTransactions.and.returnValue(of(mockTransactions));

    component.ngOnInit();
    const incomeTransaction = component.combinedHistory.find(t => t.type === 'Income');
    const expenseTransaction = component.combinedHistory.find(t => t.type === 'Expense');
    
    expect(incomeTransaction?.comment).toBe('Системное пополнение счёта');
    expect(expenseTransaction?.comment).toBe('');
  });

  it('should return the correct transaction type', () => {
    expect(component.getTransactionType('Income')).toBe('Пополнение');
    expect(component.getTransactionType('Expense')).toBe('Перевод');
    expect(component.getTransactionType('Other')).toBe('Other');
  });

  it('should return the correct currency symbol', () => {
    expect(component.getCurrencySymbol(Currency.USD)).toBe('$');
    expect(component.getCurrencySymbol(Currency.EUR)).toBe('€');
    expect(component.getCurrencySymbol(Currency.RUB)).toBe('₽');
    expect(component.getCurrencySymbol(Currency.CNY)).toBe('¥');
    expect(component.getCurrencySymbol(999)).toBe('');
  });
});

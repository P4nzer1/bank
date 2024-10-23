import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService]
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен получать список транзакций', () => {
    const mockTransactions = [
      { id: '1', amount: 100, type: 'credit' },
      { id: '2', amount: 50, type: 'debit' }
    ];

    service.getTransactions().subscribe(transactions => {
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne('/api/transactions');
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions); 
  });

  it('должен получать транзакции по ID счета', () => {
    const accountId = '12345';
    const mockTransactions = [
      { id: '1', accountId: '12345', amount: 100, type: 'credit' }
    ];

    service.getTransactionsByAccount(accountId).subscribe(transactions => {
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne(`/api/transactions/byAccount/${accountId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions);
  });

  it('должен получать информацию о транзакции по ID', () => {
    const transactionId = 'tx123';
    const mockTransactionInfo = { id: 'tx123', amount: 100, type: 'credit' };

    service.getTransactionInfo(transactionId).subscribe(info => {
      expect(info).toEqual(mockTransactionInfo);
    });

    const req = httpMock.expectOne(`/api/transactions/info/${transactionId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactionInfo);
  });
});

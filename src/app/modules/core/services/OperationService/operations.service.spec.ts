import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OperationService } from './operation.service';

describe('OperationService', () => {
  let service: OperationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperationService]
    });

    service = TestBed.inject(OperationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен запускать операцию через startOperation()', () => {
    const mockResponse = { requestId: '123' };
    const operationCode = 'AccountRefill';

    service.startOperation(operationCode).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/operations');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ operationCode });
    req.flush(mockResponse);
  });

  it('должен отправлять шаг операции через proceedOperation()', () => {
    const requestId = '122';
    const stepData = { step: 1, data: 'test' };
    const mockResponse = { success: true };

    service.proceedOperation(requestId, stepData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/operations?requestId=${requestId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(stepData);
    req.flush(mockResponse);
  });

  it('должен подтверждать операцию через confirmOperation()', () => {
    const requestId = '134';
    const mockResponse = { success: true };

    service.confirmOperation(requestId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/operations?requestId=${requestId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('должен удалять операцию через deleteOperation()', () => {
    const operationId = '1421';
    const mockResponse = { success: true };

    service.deleteOperation(operationId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`api/operations/${operationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('должен получать список операций через getOperations()', () => {
    const mockOperations = [
      { operationId: '1', operationCode: 'AccountRefill' },
      { operationId: '2', operationCode: 'AccountTransfer' }
    ];

    service.getOperations().subscribe(operations => {
      expect(operations).toEqual(mockOperations);
    });

    const req = httpMock.expectOne('/api/accounts');
    expect(req.request.method).toBe('GET');
    req.flush(mockOperations);
  });
});

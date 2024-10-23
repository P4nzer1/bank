import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardService } from './card.service';

describe('CardService', () => {
  let service: CardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [CardService]
    });

    service = TestBed.inject(CardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен получать список карт через getCards()', () => {
    const mockCards = [
      { cardId: '1', number: '1', balance: 1000 },
      { cardId: '2', number: '3', balance: 2000 }
    ];

    service.getCards().subscribe(cards => {
      expect(cards.length).toBe(2);
      expect(cards).toEqual(mockCards);
    });

    const req = httpMock.expectOne('/api/cards');
    expect(req.request.method).toBe('GET');
    req.flush(mockCards);
  });

  it('должен получать CVC карты через getCvc()', () => {
    const mockCvc = { cvc: '123' };

    service.getCvc('1').subscribe(cvc => {
      expect(cvc).toEqual(mockCvc);
    });

    const req = httpMock.expectOne('/api/cards/1/cvc');
    expect(req.request.method).toBe('GET');
    req.flush(mockCvc);
  });

  it('должен получать заказы на карты через getCardOrders()', () => {
    const mockOrders = [
      { orderId: '1', cardType: 'Visa' },
      { orderId: '2', cardType: 'Mastercard' }
    ];

    service.getCardOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne('/api/cards/orders');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('должен активировать карту через activateCard()', () => {
    const mockResponse = { success: true };

    service.activateCard('1', '1234').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/cards/activate/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ pinCode: '1234' });
    req.flush(mockResponse);
  });

  it('должен блокировать карту через lockCard()', () => {
    const mockResponse = { success: true };

    service.lockCard('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/cards/lock/1');
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('должен разблокировать карту через unlockCard()', () => {
    const mockResponse = { success: true };

    service.unlockCard('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/cards/unlock/1');
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });
});

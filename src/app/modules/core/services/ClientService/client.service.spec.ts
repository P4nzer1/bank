import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [ClientService]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен регистрировать клиента через registerClient()', () => {
    const mockClientData = { name: 'John', login: 'PAPUAS23', password: '13423123Nik' };
    const mockResponse = { success: true };

    service.registerClient(mockClientData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/clients');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockClientData);
    req.flush(mockResponse);
  });

  it('должен получать информацию о клиенте через getClient()', () => {
    const mockClient = { id: '1', name: 'John Doe', email: 'john@example.com' };

    service.getClient().subscribe(client => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne('/api/clients');
    expect(req.request.method).toBe('GET');
    req.flush(mockClient);
  });

  it('должен обновлять информацию о клиенте через updateClient()', () => {
    const mockClientData = { id: '1', name: 'John Doe' };
    const mockResponse = { success: true };

    service.updateClient(mockClientData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/clients');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockClientData);
    req.flush(mockResponse);
  });

  it('должен удалять клиента через deleteClient()', () => {
    const mockResponse = { success: true };

    service.deleteClient().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/clients');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('должен обновлять пароль через updatePassword()', () => {
    const mockPasswordData = { password: 'newPassword' };
    const mockResponse = { success: true };

    service.updatePassword(mockPasswordData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/clients/password');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockPasswordData);
    req.flush(mockResponse);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  describe('#isLoggedIn', () => {
    it('должен возвращать true, если токен существует', () => {
      spyOn(localStorage, 'getItem').and.returnValue('test-token'); 
      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTrue();
      });
    });

    it('должен возвращать false, если токена нет', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null); 
      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalse();
      });
    });
  });

  it('должен выполнять запрос на логин', () => {
    const credentials = { login: 'test', password: 'password' };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/authorization/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse); 
  });

  it('должен обновлять токен с помощью refreshToken()', () => {
    const mockResponse = { token: 'new-fake-jwt-token' };
    
    service.refreshToken('old-refresh-token').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/authorization/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'old-refresh-token' });
    req.flush(mockResponse);
  });

  it('должен выполнять запрос на logout', () => {
    service.logout().subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/authorization/logout');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('должен выполнять запрос на регистрацию', () => {
    const registrationData = { name: 'test', login: 'testuser', password: 'password' };
    const mockResponse = { success: true };

    service.register(registrationData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/clients');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(registrationData);
    req.flush(mockResponse);
  });

  it('должен получать информацию о клиенте через getClient()', () => {
    const mockClientData = { id: '1', name: 'John Doe' };

    service.getClient().subscribe(client => {
      expect(client).toEqual(mockClientData);
    });

    const req = httpMock.expectOne('api/clients');
    expect(req.request.method).toBe('GET');
    req.flush(mockClientData);
  });

  it('должен обновлять информацию о клиенте через updateClient()', () => {
    const mockClientData = { id: '1', name: 'John Doe' };
    
    service.updateClient(mockClientData).subscribe(response => {
      expect(response).toEqual(mockClientData);
    });

    const req = httpMock.expectOne('api/clients');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockClientData);
    req.flush(mockClientData);
  });

  it('должен удалять клиента через deleteClient()', () => {
    service.deleteClient().subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/clients');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('должен изменять пароль через changePassword()', () => {
    const passwordData = { oldPassword: 'oldPass', newPassword: 'newPass' };
    service.changePassword(passwordData).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpMock.expectOne('/api/clients/password');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(passwordData);  
    req.flush({ success: true });
  });

  describe('#Token management', () => {
    it('должен сохранять токен через saveToken()', () => {
      const spy = spyOn(localStorage, 'setItem');
      service.saveToken('new-token');
      expect(spy).toHaveBeenCalledWith('accessToken', 'new-token');
    });

    it('должен получать токен через getToken()', () => {
      spyOn(localStorage, 'getItem').and.returnValue('existing-token');
      const token = service.getToken();
      expect(token).toBe('existing-token');
    });

    it('должен удалять токен через removeToken()', () => {
      const spy = spyOn(localStorage, 'removeItem');
      service.removeToken();
      expect(spy).toHaveBeenCalledWith('accessToken');
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен добавлять заголовок Authorization, если accessToken присутствует в localStorage', () => {
    const accessToken = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(accessToken);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${accessToken}`);
    req.flush({});
  });

  it('не должен добавлять заголовок Authorization, если accessToken отсутствует в localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('должен обрабатывать ошибки 401 (Unauthorized)', () => {
    const accessToken = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(accessToken);
  
    httpClient.get('/test').subscribe(
      () => fail('Ожидаем ошибку 401'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      }
    );
  
    const req = httpMock.expectOne('/test');
    req.flush({ errorMessage: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });
  
  it('должен обрабатывать ошибки 500 (Internal Server Error)', () => {
    const accessToken = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(accessToken);
  
    httpClient.get('/test').subscribe(
      () => fail('Ожидаем ошибку 500'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );
  
    const req = httpMock.expectOne('/test');
  
    req.flush({ errorMessage: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
  });
  
  
});

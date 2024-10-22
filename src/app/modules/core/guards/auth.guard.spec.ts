import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/AuthService/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('должен разрешить аутентифицированному пользователю доступ к маршруту', (done) => {
    authService.isLoggedIn.and.returnValue(of(true));

    guard.canActivate(null as any, null as any).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('должен перенаправить неаутентифицированного пользователя на страницу входа', (done) => {
    authService.isLoggedIn.and.returnValue(of(false));

    const mockUrlTree = { url: '/auth/login' } as any;
    router.createUrlTree.and.returnValue(mockUrlTree);

    guard.canActivate(null as any, null as any).subscribe(result => {
      expect(result).toBe(mockUrlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login'], {
        queryParams: { returnUrl: undefined }
      });
      done();
    });
  });

  it('должен разрешить аутентифицированному пользователю доступ к дочернему маршруту', (done) => {
    authService.isLoggedIn.and.returnValue(of(true));

    guard.canActivateChild(null as any, null as any).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('должен перенаправить неаутентифицированного пользователя на страницу входа (canActivateChild)', (done) => {
    authService.isLoggedIn.and.returnValue(of(false));

    const mockUrlTree = { url: '/auth/login' } as any;
    router.createUrlTree.and.returnValue(mockUrlTree);

    guard.canActivateChild(null as any, null as any).subscribe(result => {
      expect(result).toBe(mockUrlTree);
      done();
    });
  });

  it('должен разрешить загрузку модуля для авторизованного пользователя', (done) => {
    authService.isLoggedIn.and.returnValue(of(true));
  
    guard.canLoad().subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });
  
  it('должен перенаправить неаутентифицированного пользователя на страницу входа (canLoad)', (done) => {
    authService.isLoggedIn.and.returnValue(of(false));
  
    const mockUrlTree = { url: '/auth/login' } as any;
    router.createUrlTree.and.returnValue(mockUrlTree);
  
    guard.canLoad().subscribe(result => {
      expect(result).toBe(mockUrlTree);
      done();
    });
  });
});

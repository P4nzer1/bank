import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log('CanActivate: Проверяем авторизацию');
    return this.authService.isLoggedIn().pipe(
      map(isAuthenticated => {
        console.log('Результат авторизации в CanActivate:', isAuthenticated);
        if (isAuthenticated) {
          console.log('Пользователь авторизован, доступ разрешен');
          return true;
        } else {
          console.log('Пользователь не авторизован, перенаправляем на /auth/login');
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }
      }),
      catchError((error) => {
        console.error('Ошибка в CanActivate:', error);
        return of(this.router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        }));
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log('CanActivateChild: Проверяем авторизацию для дочернего маршрута');
    return this.canActivate(childRoute, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> {
    console.log('CanLoad: Проверяем авторизацию для ленивой загрузки');
    return this.authService.isLoggedIn().pipe(
      map(isAuthenticated => {
        console.log('Результат авторизации в CanLoad:', isAuthenticated);
        if (isAuthenticated) {
          console.log('Пользователь авторизован, модуль может быть загружен');
          return true;
        } else {
          console.log('Пользователь не авторизован, перенаправляем на /auth/login');
          return this.router.createUrlTree(['/auth/login']);
        }
      }),
      catchError((error) => {
        console.error('Ошибка в CanLoad:', error);
        return of(this.router.createUrlTree(['/auth/login']));
      })
    );
  }
}


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/core/guards/auth.guard';
import { ProtectedComponent } from './protected/protected.component';

const routes: Routes = [
  { path: 'protected', component: ProtectedComponent },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'toolbar', loadChildren: () => import('./modules/toolbar/toolbar.module').then(m => m.ToolbarModule), canActivate: [AuthGuard] },
  { path: 'operations', loadChildren: () => import('./modules/operations/operations.module').then(m => m.OperationsModule), canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },  // Редирект на /auth для главной страницы
  { path: '**', redirectTo: 'auth' } // Все несуществующие пути перенаправляются на /auth
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

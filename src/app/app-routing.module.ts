import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/core/guards/auth.guard';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)},
  { path: 'toolbar', loadChildren: () => import('./modules/toolbar/toolbar.module').then(m => m.ToolbarModule),canActivate:[AuthGuard] ,canActivateChild: [AuthGuard], canLoad:[AuthGuard]},
  { path: 'operations', loadChildren: () => import('./modules/operations/operations.module').then(m => m.OperationsModule),canActivate:[AuthGuard] , canActivateChild: [AuthGuard], canLoad:[AuthGuard]  },
  { path: '', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule), pathMatch: 'full' },
  { path: '**', redirectTo: 'toolbar/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
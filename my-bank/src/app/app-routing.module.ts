import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'toolbar', loadChildren: () => import('./modules/toolbar/toolbar.module').then(m => m.ToolbarModule) },
  { path: 'operations', loadChildren: () => import('./modules/operations/operations.module').then(m => m.OperationsModule) },
  { path: '', redirectTo: '/toolbar', pathMatch: 'full' },
  { path: '**', redirectTo: '/toolbar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


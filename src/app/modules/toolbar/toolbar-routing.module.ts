import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolbarRoutingModule { }

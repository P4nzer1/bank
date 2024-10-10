import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountOpenComponent } from './account-open/account-open.component';
import { AccountRefillComponent } from './account-refill/account-refill.component';
import { AccountTransferComponent } from './account-transfer/account-transfer.component';
import { CardOrderComponent } from './card-order/card-order.component';

const routes: Routes = [
  { path: 'open', component: AccountOpenComponent },
  { path: 'refill', component: AccountRefillComponent },
  { path: 'transfer', component: AccountTransferComponent },
  { path: 'order', component: CardOrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
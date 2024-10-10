import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountOpenComponent } from './account-open/account-open.component';
import { CardOrderComponent } from './card-order/card-order.component';
import { AccountRefillComponent } from './account-refill/account-refill.component';
import { AccountTransferComponent } from './account-transfer/account-transfer.component';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { OperationsRoutingModule } from './operations-routing.module';



@NgModule({
  declarations: [
    AccountOpenComponent,
    CardOrderComponent,
    AccountRefillComponent,
    AccountTransferComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    OperationsRoutingModule
  ],
  exports: [
    AccountOpenComponent,
    CardOrderComponent,
    AccountRefillComponent,
    AccountTransferComponent,
  ]
})
export class OperationsModule { }

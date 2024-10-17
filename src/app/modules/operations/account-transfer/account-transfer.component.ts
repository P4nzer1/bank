import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountOperationService } from '../../core/services/account-operation.service';
import { ProductsService } from '../../core/services/products.service';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.scss']
})
export class AccountTransferComponent {
  transferForm: FormGroup;
  accounts$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private accountOperationService: AccountOperationService,
    private productService: ProductsService
  ) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
    this.accounts$ = this.productService.getAccounts();
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      console.error('Форма заполнена неверно', this.transferForm);
      return;
    }

    this.accountOperationService.startOperation().pipe(
      switchMap(response => {
        console.log('Funds transfer operation started successfully:', response);
        const requestId = response.requestId;
        if (requestId) {
          const transferData = {
            parameters: [
              { identifier: 'fromAccount', value: this.transferForm.get('fromAccount')?.value },
              { identifier: 'toAccount', value: this.transferForm.get('toAccount')?.value },
              { identifier: 'amount', value: this.transferForm.get('amount')?.value }
            ]
          };
          return this.proceedOperation(requestId, transferData);
        } else {
          console.error('Request ID not received from server');
          throw new Error('Request ID not received');
        }
      }),
      switchMap(() => this.productService.getAccounts()), // Обновляем счета после операции
      tap(updatedAccounts => {
        console.log('Accounts updated:', updatedAccounts);
      })
    ).subscribe({
      next: () => {
        console.log('Operation completed and accounts updated successfully');
      },
      error: err => {
        console.error('Failed to complete transfer operation:', err);
      }
    });
  }

  proceedOperation(requestId: string, transferData: any): Observable<any> {
    return this.accountOperationService.proceedOperation(requestId, transferData).pipe(
      tap(response => {
        console.log('Operation proceeded successfully', response);
      })
    );
  }
}

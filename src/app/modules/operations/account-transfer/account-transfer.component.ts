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

    const transferData = {
      operationCode: 'AccountTransfer',
      parameters: [
        { identifier: 'fromAccount', value: this.transferForm.get('fromAccount')?.value },
        { identifier: 'toAccount', value: this.transferForm.get('toAccount')?.value },
        { identifier: 'amount', value: this.transferForm.get('amount')?.value }
      ]
    };

    this.accountOperationService.startOperation(transferData).pipe(
      switchMap(response => {
        console.log('Funds transfer operation started successfully:', response);
        const requestId = response.requestId;
        if (requestId) {
          return this.proceedOperation(requestId);
        } else {
          console.error('Request ID not received from server');
          throw new Error('Request ID not received');
        }
      }),
      switchMap(() => this.productService.getAccounts()),
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

  proceedOperation(requestId: string): Observable<any> {
    const stepData = this.prepareStepDataFromResponse();
    return this.accountOperationService.proceedOperation(requestId, stepData).pipe(
      tap(response => {
        console.log('Operation proceeded successfully', response);
      })
    );
  }

  private prepareStepDataFromResponse(): any {
    return this.transferForm.value;
  }
}

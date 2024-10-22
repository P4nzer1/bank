import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountOperationService } from '../../core/services/AccountOperationService/account-operation.service';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { Observable } from 'rxjs';
import { Currency } from '../../core/interface/currency';
import { switchMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../general/confirmation-dialog/confirmation-dialog.component';
import { StepParam } from '../../core/interface/step-param';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.scss']
})
export class AccountTransferComponent implements OnInit {
  transferForm: FormGroup;
  accounts$: Observable<any[]> = new Observable<any[]>();

  constructor(
    private fb: FormBuilder,
    private accountOperationService: AccountOperationService,
    private productService: ProductsService,
    private dialog: MatDialog

  ) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.accounts$ = this.productService.getAccounts().pipe(
      map(accounts => accounts.map(account => ({
        value: `[${account.number}] ${account.name} *${String(account.number).slice(-4)} (${account.balance} ${this.convertCurrencyToString(account.currency)})`
      })))
    );
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      console.error('Форма заполнена неверно', this.transferForm);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { operationName: 'перевод между счетами' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performTransfer();
      }
    });
  }
  
  performTransfer(): void {
    this.accountOperationService.startOperation('AccountTransfer').pipe(
      switchMap(response => {
        const requestId = response.requestId;
        if (requestId) {
          const transferData = this.collectStepFormData(response.stepParams);
          console.log('Transfer Data:', transferData);
          return this.proceedOperation(requestId, transferData);
        } else {
          throw new Error('Request ID не получен');
        }
      })
    ).subscribe({
      next: (response) => {
        console.log('Операция завершена');
        if (response.stepParams) {
          this.updateFormWithStepParams(response.stepParams);
        } else {
          this.confirmOperation(response.requestId);
        }
      },
      error: err => {
        console.error('Ошибка при выполнении перевода средств:', err);
      }
    });
  }
  

  proceedOperation(requestId: string, transferData: any): Observable<any> {
    return this.accountOperationService.proceedOperation(requestId, transferData);
  }

  collectStepFormData(stepParams: StepParam[]): { identifier: string, value: any }[] {
    const formData: { identifier: string, value: any }[] = [];

    stepParams.forEach(param => {
      if (param.identifier === 'SourceAccount') {
        formData.push({
          identifier: param.identifier,
          value: this.replaceCurrencyCode(this.transferForm.get('fromAccount')?.value || '')
        });
      } else if (param.identifier === 'ReceiverAccount') {
        formData.push({
          identifier: param.identifier,
          value: this.extractAccountNumber(this.transferForm.get('toAccount')?.value || '')
        });
      } else if (param.identifier === 'Amount') {
        formData.push({
          identifier: param.identifier,
          value: this.transferForm.get('amount')?.value.toString() || ''
        });
      } else if (param.identifier === 'Comment') {
        formData.push({
          identifier: param.identifier,
          value: this.transferForm.get('comment')?.value || ''
        });
      }
    });

    return formData;
  }

  confirmOperation(operationId: string): void {
    this.accountOperationService.confirmOperation(operationId).subscribe({
      next: response => {
        console.log('Операция успешно подтверждена', response);
      },
      error: err => {
        console.error('Ошибка при подтверждении операции:', err);
      }
    });
  }

  updateFormWithStepParams(stepParams: StepParam[]): void {
    stepParams.forEach(param => {
      if (!this.transferForm.contains(param.identifier)) {
        const validators = param.required ? [Validators.required] : [];
        this.transferForm.addControl(param.identifier, this.fb.control('', validators));
      }
    });
  }

  convertCurrencyToString(currency: Currency): string {
    switch (currency) {
      case Currency.USD: return 'USD';
      case Currency.EUR: return 'EUR';
      case Currency.RUB: return 'RUB';
      case Currency.CNY: return 'CNY';
      default: return 'Unknown Currency';
    }
  }

  replaceCurrencyCode(accountValue: string): string {
    return accountValue.replace('643', 'RUB');
  }

  extractAccountNumber(accountValue: string): string {
    const accountNumberMatch = accountValue.match(/\d{20}/);
    if (accountNumberMatch) {
      return accountNumberMatch[0];
    }
    return accountValue;
  }
}

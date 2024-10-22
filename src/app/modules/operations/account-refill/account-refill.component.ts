import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { AccountOperationService } from '../../core/services/AccountOperationService/account-operation.service'; 
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../general/confirmation-dialog/confirmation-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-refill',
  templateUrl: './account-refill.component.html',
  styleUrls: ['./account-refill.component.scss']
})
export class AccountRefillComponent implements OnInit {
  refillForm: FormGroup;
  accounts$: Observable<any[]> | null = null; 
  loading: boolean = false;
  errorMessage: string = ''; 
  accounts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private accountOperationService: AccountOperationService,
    private dialog: MatDialog
  ) {
    this.refillForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0), Validators.max(1000000000)]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }
  
  onSubmit() {
    if (this.refillForm.invalid) {
      console.error('Форма заполнена неверно', this.refillForm);
      return;
    }
    const accountNumber = this.refillForm.get('accountNumber')?.value;
    const amount = this.refillForm.get('amount')?.value;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { operationName: 'пополнение счета' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performRefill(accountNumber, amount);
      }
    });
  }

  performRefill(accountNumber: string, amount: number) {
    this.loading = true;
    this.accountOperationService.startOperation('AccountRefill').subscribe({
      next: (response) => {
        const requestId = response.requestId;
        if (requestId) {
          this.handleStepParams(response.stepParams, requestId, accountNumber, amount);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Ошибка при запуске операции:', err);
        this.loading = false;
      }
    });
  }
  
  loadAccounts() {
    this.accounts$ = this.productService.getAccounts().pipe(
      map(accounts => accounts.map(account => ({
        value: `[${account.number}] ${account.name} *${String(account.number).slice(-4)} (${account.balance} ${this.convertCurrencyToString(account.currency)})`
      })))
    );
  }

  handleStepParams(stepParams: any[], requestId: string, accountNumber: string, amount: number): void {
    const formData = this.collectStepFormData(stepParams, accountNumber, amount);
    this.proceedOperation(requestId, formData);
  }
  
  collectStepFormData(stepParams: any[], accountNumber: string, amount: number): { identifier: string, value: any }[] {
    const formData: { identifier: string, value: any }[] = [];
  
    stepParams.forEach((param: any) => {
      if (param.identifier === 'Account') {
        formData.push({
          identifier: param.identifier,
          value: String(accountNumber) 
        });
      } else if (param.identifier === 'Amount') {
        formData.push({
          identifier: param.identifier,
          value: String(amount) 
        });
      }
    });
    return formData;
  }
  
  confirmOperation(operationId: string): void {
    this.accountOperationService.confirmOperation(operationId.toString()).subscribe({
      next: response => {
        console.log('Операция успешно подтверждена', response);
      },
      error: err => {
        console.error('Ошибка при подтверждении операции:', err);
      }
    });
  }

  proceedOperation(requestId: string, stepData: { identifier: string, value: any }[]): void {
    this.accountOperationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
        this.confirmOperation(requestId);
        console.log('Операция успешно обработана', response);
        if (response.stepParams) {
          this.handleStepParams(response.stepParams, requestId, stepData[0].value, stepData[1].value);
        } else {
          console.log('Операция завершена');
          this.updateAccounts(); 
        }
      },
      error: err => {
        console.error('Ошибка при выполнении следующего шага операции:', err);
        this.loading = false;
      }
    });
  }

  updateAccounts(): void {
    this.productService.getAccounts().subscribe({
      next: (updatedAccounts) => {
        console.log('Обновленные счета:', updatedAccounts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка при обновлении счетов', err);
        this.loading = false;
      }
    });
  }

  convertCurrencyToString(currency: number): string {
    switch (currency) {
      case 840: return 'USD';
      case 978: return 'EUR';
      case 643: return 'RUB';
      case 156: return 'CNY';
      default: return 'Unknown Currency';
    }
  }
}

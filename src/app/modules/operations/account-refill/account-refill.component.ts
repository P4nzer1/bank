import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { AccountOperationService } from '../../core/services/AccountOperationService/account-operation.service'; 
import { OperationService } from '../../core/services/OperationService/operation.service';
import { Observable } from 'rxjs';

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
  selectedAccount: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private accountOperationService: AccountOperationService,
    private operationService: OperationService,
  ) {
    this.refillForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0), Validators.max(1000000000)]]
    });
  }

  ngOnInit(): void {
    this.accounts$ = this.productService.getAccounts();
    this.accounts$.subscribe(accounts => {
      console.log('Полученные счета:', accounts); 
    this.loadAccounts()
    });
  }
  
  onSubmit() {
    if (this.refillForm.invalid) {
      console.error('Форма заполнена неверно', this.refillForm);
      return;
    }
  
    const accountNumber = this.refillForm.get('accountNumber')?.value;
    const amount = this.refillForm.get('amount')?.value;
  
    this.loading = true; 
  
    this.accountOperationService.startOperation('AccountRefill').subscribe({
      next: (response) => {
        console.log('Операция пополнения счета успешно запущена', response);
        const requestId = response.requestId;
        if (requestId) {
          this.handleStepParams(response.stepParams, requestId, accountNumber, amount);
        } else {
          console.error('Request ID не получен');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Ошибка при запуске операции:', err);
        this.errorMessage = 'Ошибка при запуске операции';
        this.loading = false;
      }
    });
  }
  loadAccounts() {
    this.operationService.getOperations().subscribe(
      (data: any) => {
        this.accounts = data.filter((account:any) => account.state === 'Active');
      },
      (error) => {
        console.error('Ошибка при загрузке счетов:', error);
      }
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
        // Проверка, есть ли шаги для следующей операции
        if (response.stepParams) {
          this.handleStepParams(response.stepParams, requestId, stepData[0].value, stepData[1].value);
        } else {
          console.log('Операция завершена');
          this.updateAccounts(); // Обновляем данные счетов после завершения операции
        }
      },
      error: err => {
        console.error('Ошибка при выполнении следующего шага операции:', err);
        this.loading = false;
      }
    });
  }

  // Обновление счетов после завершения операции
  updateAccounts(): void {
    this.productService.getAccounts().subscribe({
      next: (updatedAccounts) => {
        console.log('Обновленные счета:', updatedAccounts);
        this.loading = false; // Отключаем флаг загрузки
      },
      error: (err) => {
        console.error('Ошибка при обновлении счетов', err);
        this.loading = false;
      }
    });
  }
}

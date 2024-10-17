import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { AccountOperationService } from '../../core/services/account-operation.service'; // Импортируем сервис для операций с аккаунтами
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-refill',
  templateUrl: './account-refill.component.html',
  styleUrls: ['./account-refill.component.scss']
})
export class AccountRefillComponent implements OnInit {
  refillForm: FormGroup;
  accounts$: Observable<any[]> | null = null; // Инициализация как Observable
  loading: boolean = false;
  errorMessage: string = ''; // Для отображения ошибок

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private accountOperationService: AccountOperationService // Добавляем этот сервис
  ) {
    this.refillForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0), Validators.max(1000000000)]]
    });
  }

  ngOnInit(): void {
    this.accounts$ = this.productService.getAccounts();
    this.accounts$.subscribe(accounts => {
      console.log('Полученные счета:', accounts); // Проверка данных
    });
  }
  
  onSubmit() {
    if (this.refillForm.invalid) {
      console.error('Форма заполнена неверно', this.refillForm);
      return;
    }
  
    const accountNumber = this.refillForm.get('accountNumber')?.value;
    const amount = this.refillForm.get('amount')?.value;
  
    this.loading = true; // Включаем флаг загрузки
  
    // Запуск операции пополнения счета
    this.accountOperationService.startOperation('AccountRefill').subscribe({
      next: (response) => {
        console.log('Операция пополнения счета успешно запущена', response);
        const requestId = response.requestId;
        if (requestId) {
          // Передача данных на втором шаге
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
  
  handleStepParams(stepParams: any[], requestId: string, accountNumber: string, amount: number): void {
    const formData = this.collectStepFormData(stepParams, accountNumber, amount);
    this.proceedOperation(requestId, formData);
  }
  
  collectStepFormData(stepParams: any[], accountNumber: string, amount: number): { name: string, value: any }[] {
    const formData: { name: string, value: any }[] = [];
  
    stepParams.forEach((param: any) => {
      if (param.name === 'Счёт пополнения') {
        formData.push({
          name: param.name,
          value: String(accountNumber) // Преобразование accountNumber в строку
        });
      } else if (param.name === 'Сумма пополнения') {
        formData.push({
          name: param.name,
          value: Number(amount) // Преобразование amount в число
        });
      }
    });
  
    return formData;
  }
  
  

  proceedOperation(requestId: string, stepData: { name: string, value: any }[]): void {
    this.accountOperationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
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

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
      amount: ['', [Validators.required, Validators.min(1)]]
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
  
    this.accountOperationService.refillAccount(accountNumber, amount).subscribe({
      next: (response) => {
        console.log('Счет успешно пополнен', response);
        
        // Обновляем данные о счетах пользователя
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
      },
      error: (err) => {
        console.error('Ошибка при пополнении счета', err);
        this.errorMessage = 'Ошибка при пополнении счета';
        this.loading = false; // Отключаем флаг загрузки
      }
    });
  }
}

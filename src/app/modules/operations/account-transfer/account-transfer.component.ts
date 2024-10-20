import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountOperationService } from '../../core/services/AccountOperationService/account-operation.service';
import { ProductsService } from '../../core/services/ProductService/products.service';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { StepParam } from '../../core/interface/step-param';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.scss']
})
export class AccountTransferComponent {
  transferForm: FormGroup;
  accounts$: Observable<any>; // Счета пользователя
  cards$: Observable<any>; // Карты пользователя

  constructor(
    private fb: FormBuilder,
    private accountOperationService: AccountOperationService,
    private productService: ProductsService
  ) {
    // Форма перевода средств
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      comment: [''],
    });

    // Получаем список счетов и карт пользователя
    this.accounts$ = this.productService.getAccounts();
    this.cards$ = this.productService.getCards();
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      console.error('Форма заполнена неверно', this.transferForm);
      return;
    }

    this.accountOperationService.startOperation('AccountTransfer').pipe(
      switchMap(response => {
        const requestId = response.requestId;
        if (requestId) {
          // Собираем данные для шага операции
          const transferData = this.collectStepFormData(response.stepParams);
          console.log('Transfer Data:', transferData);  // Лог для проверки данных
          return this.proceedOperation(requestId, transferData);
        } else {
          console.error('Request ID не получен с сервера');
          throw new Error('Request ID не получен');
        }
      }),
      switchMap(() => this.productService.getAccounts()), // Обновляем счета после операции
      tap(updatedAccounts => {
        console.log('Счета обновлены:', updatedAccounts);
      })
    ).subscribe({
      next: () => {
        console.log('Операция завершена и счета обновлены');
      },
      error: err => {
        console.error('Ошибка при выполнении перевода средств:', err);
      }
    });
  }

  proceedOperation(requestId: string, transferData: any): Observable<any> {
    console.log('Transfer Data:', transferData);  // Логируем данные перед отправкой
  
    return this.accountOperationService.proceedOperation(requestId, transferData).pipe(
      tap(response => {
        console.log('Операция успешно продолжена', response);
      })
    );
  }
  

  collectStepFormData(stepParams: StepParam[]): { identifier: string, value: any }[] {
    const formData: { identifier: string, value: any }[] = [];
  
    stepParams.forEach((param: StepParam) => {
      if (param.identifier === 'SourceAccount') {
        formData.push({
          identifier: param.identifier,
          value: this.transferForm.get('fromAccount')?.value
        });
      } else if (param.identifier === 'RecipientAccount') { 
        formData.push({
          identifier: param.identifier,
          value: this.transferForm.get('toAccount')?.value
        });
      } else if (param.identifier === 'Amount') {
        formData.push({
          identifier: param.identifier,
          value: this.transferForm.get('amount')?.value
        });
      } else if (param.identifier === 'Comment') {
        formData.push({
          identifier: param.identifier,
          value: this.transferForm.get('comment')?.value || ''
        });
      }
    });
  
    console.log('Collected Step Form Data:', formData); 
    return formData;
  }
  
}

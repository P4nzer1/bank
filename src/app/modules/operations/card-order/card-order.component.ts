import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountOperationService } from '../../core/services/AccountOperationService/account-operation.service';
import { StepParam } from '../../core/interface/step-param';

@Component({
  selector: 'app-card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss']
})
export class CardOrderComponent {
  cardForm: FormGroup;
  programTypes = ['МИР', 'Visa', 'Mastercard', 'Maestro']; // Программы выпуска карт

  constructor(private fb: FormBuilder, private accountOperationService: AccountOperationService) {
    this.cardForm = this.fb.group({
      cardType: ['', Validators.required],
      programType: ['', Validators.required],
      deliveryAddress: ['', Validators.required], // Убедитесь, что этот параметр нужен
    });
  }

  onSubmit() {
    if (this.cardForm.invalid) {
      console.error('Форма заполнена неверно:', this.cardForm);
      return;
    }

    // Стартуем операцию заказа карты
    this.accountOperationService.startOperation('CardOrder').subscribe(
      response => {
        console.log('Card order operation started successfully', response);
        const requestId = response.requestId;
        if (requestId) {
          this.handleStepParams(response.stepParams, requestId); // Обрабатываем шаги
        } else {
          console.error('Request ID не получен с сервера');
        }
      },
      error => {
        console.error('Failed to start card order operation', error);
      }
    );
  }

  handleStepParams(stepParams: StepParam[], requestId: string): void {
    const formData = this.collectStepFormData(stepParams);
    this.proceedOperation(requestId, formData);
  }

  collectStepFormData(stepParams: StepParam[]): { identifier: string, value: any }[] {
    const formData: { identifier: string, value: any }[] = [];

    stepParams.forEach((param: StepParam) => {
      if (param.identifier === 'Product') {
        formData.push({
          identifier: param.identifier,
          value: this.cardForm.get('cardType')?.value === 'Дебетовая' ? 'Дебетовая карта' : 'Кредитная карта' // Правильное значение
        });
      } else if (param.identifier === 'ProgramType') {
        formData.push({
          identifier: param.identifier,
          value: this.cardForm.get('programType')?.value
        });
      }
    });

    return formData;
  }

  proceedOperation(requestId: string, stepData: { identifier: string, value: string }[]): void {
    this.accountOperationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
        console.log('Операция успешно обработана', response);
        if (response.stepParams) {
          this.handleStepParams(response.stepParams, requestId); // Продолжаем шаги, если они есть
        } else {
          this.confirmOperation(requestId); // Подтверждаем операцию, если шагов больше нет
        }
      },
      error: err => {
        console.error('Ошибка при выполнении следующего шага операции:', err);
      }
    });
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
}

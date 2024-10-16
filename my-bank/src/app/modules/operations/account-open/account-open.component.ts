import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountOperationService } from '../../core/services/account-operation.service';
import { AccountState } from '../../core/interface/account-state.enum';

@Component({
  selector: 'app-account-open',
  templateUrl: './account-open.component.html',
  styleUrls: ['./account-open.component.scss']
})
export class AccountOpenComponent {
  accountForm: FormGroup;
  stepParams: any[] = [
    {
      type: 'multiple', // Тип параметра, например, выпадающий список
      name: 'Тип счета', // Название параметра, которое будет отображаться пользователю
      identifier: 'accountType', // Идентификатор параметра для привязки к форме
      values: ['Сберегательный', 'Текущий', 'Инвестиционный'], // Возможные значения для выбора
      required: true
    },
    {
      type: 'text', // Тип параметра, например, текстовое поле
      name: 'Начальный взнос', // Название параметра, которое будет отображаться пользователю
      identifier: 'initialDeposit', // Идентификатор параметра для привязки к форме
      required: true
    }
  ];

  constructor(private fb: FormBuilder, private accountOperationService: AccountOperationService) {
    this.accountForm = this.fb.group({});
    this.initializeForm();
  }

  initializeForm(): void {
    // Добавляем основные поля формы
    this.accountForm.addControl('accountType', new FormControl('', Validators.required));
    this.accountForm.addControl('initialDeposit', new FormControl('', [Validators.required, Validators.min(100)]));

    // Добавляем контролы для динамических параметров
    this.stepParams.forEach(param => {
      if (!this.accountForm.contains(param.identifier)) {
        const validators = param.required ? [Validators.required] : [];
        this.accountForm.addControl(param.identifier, new FormControl('', validators));
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      console.error('Форма заполнена неверно', this.accountForm);
      return;
    }

    const operationData = {
      operationCode: 'AccountOpen',
      accountType: this.accountForm.get('accountType')?.value,
      initialDeposit: this.accountForm.get('initialDeposit')?.value
    };
    console.log('Operation Data:', operationData);

    const accountStatus: string = 'Created'; 
    if (accountStatus === AccountState.Blocked) {
      console.log('Account is blocked');
      return;
    }

    this.accountOperationService.startOperation(operationData).subscribe(
      response => {
        console.log('Account opened successfully', response);
        const requestId = response.requestId; // Используем requestId для следующего шага
        if (requestId) {
          this.proceedOperation(requestId);
        } else {
          console.error('Request ID not received from server');
        }
      },
      error => {
        console.error('Failed to open account:', error);
      }
    );
  }

  proceedOperation(requestId: string): void {
    const stepData = this.prepareStepDataFromResponse();
    this.accountOperationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
        console.log('Operation proceeded successfully', response);

        // Если есть следующий шаг, обновляем форму и перерисовываем её
        if (response.stepParams) {
          this.stepParams = response.stepParams;
          this.updateFormWithStepParams(this.stepParams);
        } else {
          // Если больше нет шагов, операция завершена
          console.log('Operation completed successfully');
        }
      },
      error: err => {
        console.error('Failed to proceed operation:', err);
      }
    });
  }

  updateFormWithStepParams(stepParams: any[]): void {
    stepParams.forEach(param => {
      if (!this.accountForm.contains(param.identifier)) {
        const validators = param.required ? [Validators.required] : [];
        this.accountForm.addControl(param.identifier, new FormControl('', validators));
      }
    });
  }

  private prepareStepDataFromResponse(): any {
    return this.stepParams.map(param => ({
      identifier: param.identifier,
      value: this.accountForm.get(param.identifier)?.value
    }));
  }
}



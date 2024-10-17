import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountOperationService } from '../../core/services/account-operation.service';
import { StepParam } from '../../core/interface/step-param';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../general/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-account-open',
  templateUrl: './account-open.component.html',
  styleUrls: ['./account-open.component.scss']
})
export class AccountOpenComponent {
  accountForm: FormGroup;
  stepParams: StepParam[] = [];

  constructor(private fb: FormBuilder, private accountOperationService: AccountOperationService, private dialog: MatDialog ) {
    this.accountForm = this.fb.group({});
    this.initializeForm();
  }

  initializeForm(): void {
    this.accountForm.addControl('AccountType', new FormControl('', Validators.required));
    this.accountForm.addControl('initialDeposit', new FormControl('', [Validators.required, Validators.min(100)]));
  }
  
  // Начальная операция без аргументов
  onSubmit(): void {
    if (this.accountForm.invalid) {
      console.error('Форма заполнена неверно', this.accountForm);
      return;
    }
  
    this.accountOperationService.startOperation().subscribe(
      response => {
        console.log('Операция открытия счета успешно запущена', response);
        const requestId = response.requestId; 
        if (requestId) {
          this.proceedOperation(requestId);  // Переходим к следующему шагу с requestId
        } else {
          console.error('Request ID не получен с сервера');
        }
      },
      error => {
        console.error('Ошибка при запуске операции:', error);
      }
    );
  }

  // Следующий шаг операции с параметрами
  proceedOperation(requestId: string): void {
    const stepData = this.prepareStepDataFromResponse();
    
    this.accountOperationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
        console.log('Операция успешно обработана', response);

        if (response.stepParams) {
          this.stepParams = response.stepParams;
          this.updateFormWithStepParams(this.stepParams);
        } else {
          console.log('Операция завершена');
          if (response.operationId) {
            this.confirmOperation(response.operationId);
          }
        }
      },
      error: err => {
        console.error('Ошибка при выполнении следующего шага операции:', err);
      }
    });
  }

  // Подтверждение операции
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

  // Обновление формы с параметрами шага
  updateFormWithStepParams(stepParams: StepParam[]): void {
    stepParams.forEach(param => {
      if (!this.accountForm.contains(param.identifier)) {
        const validators = param.required ? [Validators.required] : [];
        this.accountForm.addControl(param.identifier, new FormControl('', validators));
      }
    });
  }

  // Подготовка данных для следующего шага
  private prepareStepDataFromResponse(): any {
    return this.stepParams.map(param => ({
      identifier: param.identifier,
      value: this.accountForm.get(param.identifier)?.value?.toString() || '' 
    }));
  }
}



import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountOperationService } from '../../core/services/AccountOperationService/account-operation.service';
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

  constructor(private fb: FormBuilder, private accountOperationService: AccountOperationService, private dialog: MatDialog) {
    this.accountForm = this.fb.group({
      AccountType: ['', Validators.required],
      InitialDeposit: ['', [Validators.required, Validators.min(100)]],
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      console.error('Форма заполнена неверно', this.accountForm);
      return;
    }
    this.accountOperationService.startOperation('AccountOpen').subscribe(
      response => {
        console.log('Операция открытия счета успешно запущена', response);
        const requestId = response.requestId;
        if (requestId) {
          this.handleStepParams(response.stepParams, requestId);
        } else {
          console.error('Request ID не получен с сервера');
        }
      },
      error => {
        console.error('Ошибка при запуске операции:', error);
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
      if (param.identifier === 'AccountType') {
        formData.push({
          identifier: param.identifier,
          value: this.accountForm.get('AccountType')?.value
        });
      } else if (param.identifier === 'Currency') {
        formData.push({
          identifier: param.identifier,
          value: 'Российский Рубль'
        });
      }
    });
  
    return formData;
  }

  proceedOperation(requestId: string, stepData: { identifier: string, value: string }[]): void {
    this.accountOperationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
        this.confirmOperation(requestId);
        console.log('Операция успешно обработана', response);
        if (response.stepParams) {
          this.handleStepParams(response.stepParams, requestId);
        } else {
          console.log('Операция завершена');
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


  updateFormWithStepParams(stepParams: StepParam[]): void {
    stepParams.forEach(param => {
      if (!this.accountForm.contains(param.identifier)) {
        const validators = param.required ? [Validators.required] : [];
        this.accountForm.addControl(param.identifier, new FormControl('', validators));
      }
    });
  }
}

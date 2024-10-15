import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OperationService } from '../../core/services/operation.service';
import { AccountState } from '../../core/interface/account-state.enum';

@Component({
  selector: 'app-account-open',
  templateUrl: './account-open.component.html',
  styleUrls: ['./account-open.component.scss']
})
export class AccountOpenComponent {
  accountForm: FormGroup;
  
  stepParams: any[] = [];

  constructor(private fb: FormBuilder, private operationService: OperationService) {
    this.accountForm = this.fb.group({
      accountType: ['', Validators.required],
      initialDeposit: ['', [Validators.required, Validators.min(100)]]
    });
  }
  onSubmit() {
    if (this.accountForm.invalid) {
      console.error('Форма заполнена неверно', this.accountForm);
      return;
    }
  
    console.log('Account Type:', this.accountForm.get('accountType')?.value);
    console.log('Form Value:', this.accountForm.value);
  
    if (this.accountForm.valid) {
      const operationData = {
        operationCode: 'AccountOpen',
        accountType: this.accountForm.get('accountType')?.value,
        initialDeposit: this.accountForm.get('initialDeposit')?.value
      };
      console.log('Operation Data:', operationData); // Это нужно для проверки, что данные собираются правильно
  
      const accountStatus: string = 'Created'; 
      if (accountStatus === AccountState.Blocked) {
        console.log('Account is blocked');
        return;
      }
      
  
      this.operationService.startOperation(operationData).subscribe(
        response => {
          console.log('Account opened successfully', response);
          const requestId = response.requestId; // Используем requestId
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
  }
  
  
  updateFormWithStepParams(stepParams: any[]) {
    stepParams.forEach(param => {
      if (!this.accountForm.contains(param.identifier)) {
        this.accountForm.addControl(param.identifier, new FormControl('', param.required ? Validators.required : null));
      }
    });
  }
  proceedOperation(requestId: string) {
    const stepData = this.prepareStepDataFromResponse();
    this.operationService.proceedOperation(requestId, stepData).subscribe({
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
  private prepareStepDataFromResponse(): any {
    return this.stepParams.map(param => ({
      identifier: param.identifier,
      value: this.accountForm.get(param.identifier)?.value
    }));
  }
}
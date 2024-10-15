import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-account-refill',
  templateUrl: './account-refill.component.html',
  styleUrls: ['./account-refill.component.scss']
})
export class AccountRefillComponent {
  refillForm: FormGroup;

  constructor(private fb: FormBuilder, private operationService: OperationService) {
    this.refillForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.refillForm.invalid) {
      console.error('Форма заполнена неверно', this.refillForm);
      return;
    }

    const operationData = {
      operationCode: 'AccountRefill',
      parameters: [
        { identifier: 'accountNumber', value: this.refillForm.get('accountNumber')?.value },
        { identifier: 'amount', value: this.refillForm.get('amount')?.value }
      ]
    };

    this.operationService.startOperation(operationData).subscribe(
      response => {
        console.log('Operation started successfully:', response);
        const requestId = response.requestId;
        if (requestId) {
          this.proceedOperation(requestId);
        } else {
          console.error('Request ID not received from server');
        }
      },
      error => {
        console.error('Failed to start operation:', error);
      }
    );
  }

  proceedOperation(requestId: string) {
    const stepData = [
      { identifier: "Счёт пополнения", value: String(this.refillForm.get('accountNumber')?.value) },
      { identifier: "Сумма пополнения", value: String(this.refillForm.get('amount')?.value) }
    ];
  
    this.operationService.proceedOperation(requestId, stepData).subscribe({
      next: response => {
        console.log('Operation proceeded successfully', response);
        if (response.stepParams) {
          this.updateFormWithStepParams(response.stepParams);
        } else {
          console.log('Operation completed successfully');
        }
      },
      error: err => {
        console.error('Failed to proceed operation:', err);
      }
    });
  }
  

  updateFormWithStepParams(stepParams: any[]) {
    stepParams.forEach(param => {
      if (!this.refillForm.contains(param.identifier)) {
        this.refillForm.addControl(param.identifier, this.fb.control('', Validators.required));
      }
    });
  }
}
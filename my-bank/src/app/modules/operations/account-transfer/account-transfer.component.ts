import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.scss']
})
export class AccountTransferComponent {
  transferForm: FormGroup;

  constructor(private fb: FormBuilder, private operationService: OperationService) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.transferForm.valid) {
      const transferData = this.transferForm.value;
  
      // Запуск операции перевода средств
      this.operationService.startOperation(transferData).subscribe({
        next: response => {
          console.log('Funds transfer operation started successfully:', response);
          // Дополнительная логика: можно использовать proceedOperation и confirmOperation при необходимости
        },
        error: err => {
          console.error('Failed to start transfer operation:', err);
        }
      });
    }
  }
  
}

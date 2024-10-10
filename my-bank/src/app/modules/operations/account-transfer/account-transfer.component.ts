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
      this.operationService.transferFunds(this.transferForm.value).subscribe({
        next: response => {
          console.log('Funds transferred successfully:', response);
        },
        error: err => {
          console.error('Failed to transfer funds:', err);
        }
      });
    }
  }
}

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
    if (this.refillForm.valid) {
      this.operationService.refillAccount(this.refillForm.value).subscribe({
        next: response => {
          console.log('Account refilled successfully:', response);
        },
        error: err => {
          console.error('Failed to refill account:', err);
        }
      });
    }
  }
}

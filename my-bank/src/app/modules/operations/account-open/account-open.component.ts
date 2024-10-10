import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-account-open',
  templateUrl: './account-open.component.html',
  styleUrls: ['./account-open.component.scss']
})
export class AccountOpenComponent {
  accountForm: FormGroup;

  constructor(private fb: FormBuilder, private operationService: OperationService) {
    this.accountForm = this.fb.group({
      accountType: ['', Validators.required],
      initialDeposit: ['', [Validators.required, Validators.min(100)]]
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.operationService.openAccount(this.accountForm.value).subscribe({
        next: response => {
          console.log('Account opened successfully:', response);
        },
        error: err => {
          console.error('Failed to open account:', err);
        }
      });
    }
  }
}


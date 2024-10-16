import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountOperationService } from '../../core/services/account-operation.service';

@Component({
  selector: 'app-account-refill',
  templateUrl: './account-refill.component.html',
  styleUrls: ['./account-refill.component.scss']
})
export class AccountRefillComponent {
  refillForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountOperationService: AccountOperationService
  ) {
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

    const accountNumber = this.refillForm.get('accountNumber')?.value;
    const amount = this.refillForm.get('amount')?.value;

    this.accountOperationService.refillAccount(accountNumber, amount).subscribe(
      response => {
        console.log('Счет успешно пополнен', response);
      },
      error => {
        console.error('Ошибка при пополнении счета', error);
      }
    );
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountOperationService } from '../../core/services/account-operation.service';

@Component({
  selector: 'app-card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss']
})
export class CardOrderComponent {
  cardForm: FormGroup;

  constructor(private fb: FormBuilder, private accountOperationService: AccountOperationService) {
    this.cardForm = this.fb.group({
      cardType: ['', Validators.required],
      deliveryAddress: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.cardForm.invalid) {
      console.error('Форма заполнена неверно:', this.cardForm);
      return;
    }

    const cardOrderData = {
      cardType: this.cardForm.get('cardType')?.value,
      deliveryAddress: this.cardForm.get('deliveryAddress')?.value
    };
    const deliveryAddress = this.cardForm.get('deliveryAddress')?.value;

    this.accountOperationService.orderCard(deliveryAddress).subscribe(
      response => {
        console.log('Card order started successfully', response);
        // Дополнительная логика после успешного заказа карты
      },
      error => {
        console.error('Failed to start card order operation', error);
      }
    );
  }
}
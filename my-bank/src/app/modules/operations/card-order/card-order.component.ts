import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss']
})
export class CardOrderComponent {
  cardForm: FormGroup;

  constructor(private fb: FormBuilder, private operationService: OperationService) {
    this.cardForm = this.fb.group({
      cardType: ['', Validators.required],
      deliveryAddress: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      const cardOrderData = this.cardForm.value;
  
      // Запуск операции заказа карты
      this.operationService.startOperation(cardOrderData).subscribe({
        next: response => {
          console.log('Card order operation started successfully:', response);
          // Дополнительная логика: proceedOperation и confirmOperation, если требуется
        },
        error: err => {
          console.error('Failed to start card order operation:', err);
        }
      });
    }
  }
  
}

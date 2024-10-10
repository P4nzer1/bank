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
      this.operationService.orderCard(this.cardForm.value).subscribe({
        next: response => {
          console.log('Card ordered successfully:', response);
        },
        error: err => {
          console.error('Failed to order card:', err);
        }
      });
    }
  }
}

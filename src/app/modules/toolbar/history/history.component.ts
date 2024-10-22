import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/TransactionService/transaction.service';
import { OperationService } from '../../core/services/OperationService/operation.service';
import { Currency } from '../../core/interface/currency';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['type', 'date', 'amount', 'currency'];

  operationHistory: any[] = [];

  constructor(
    private transactionService: TransactionService,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.operationService.getOperations().subscribe(
      (data) => {
        console.log(data); 
        this.operationHistory = data;
      },
      (error) => {
        console.error('Ошибка при получении данных об операциях:', error);
      }
    );
  }
  getCurrencySymbol(currencyCode: number): string {
    switch (currencyCode) {
      case Currency.USD:
        return '$';
      case Currency.EUR:
        return '€';
      case Currency.RUB:
        return '₽';
      case Currency.CNY:
        return '¥';
      default:
        return '';
    }
  }
  
}  

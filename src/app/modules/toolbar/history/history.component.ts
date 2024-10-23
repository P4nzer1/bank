import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/TransactionService/transaction.service';
import { OperationService } from '../../core/services/OperationService/operation.service';
import { Currency } from '../../core/interface/currency';
import { Transaction } from '../../core/interface/transaction';
import { Operation } from '../../core/interface/operation';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['type', 'date', 'amount', 'currency', 'comment'];
  combinedHistory: (Operation | Transaction)[] = [];

  constructor(
    private transactionService: TransactionService,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.operationService.getOperations().subscribe(
      (operations) => {
        console.log('Operations:', operations);
        this.combinedHistory = operations;
        this.transactionService.getTransactions().subscribe(
          (transactions) => {
            console.log('Transactions:', transactions);
            const combined = [...operations, ...transactions].map(item => {
              if (!item.createdDate) {
                item.createdDate = item.paymentDate || new Date(); 
              }
  
              if (!item.currency) { 
                item.currency = Currency.RUB;
              }
  
              return item;
            });
  
            this.combinedHistory = combined;
          },
          (error) => {
            console.error('Ошибка при получении данных о транзакциях:', error);
          }
        );
      },
      (error) => {
        console.error('Ошибка при получении данных об операциях:', error);
      }
    );
  }
  

  getTransactionType(type: string): string {
    switch (type) {
      case 'Income':
        return 'Пополнение';
      case 'Expense':
        return 'Перевод';
      default:
        return type; 
    }
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

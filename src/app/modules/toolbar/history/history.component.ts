import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  displayedColumns: string[] = ['type', 'date', 'amount'];
  operationHistory = [
    { type: 'Перевод', typeIcon: 'compare_arrows', date: '2024-10-19', amount: 100 },
    { type: 'Пополнение', typeIcon: 'account_balance_wallet', date: '2024-10-20', amount: 200 },
    { type: 'Заказ карты', typeIcon: 'credit_card', date: '2024-10-21', amount: 0 },
  ];
}



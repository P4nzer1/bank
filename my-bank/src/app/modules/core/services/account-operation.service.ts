import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { OperationService } from './operation.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountOperationService {
  constructor(
    private productsService: ProductsService,
    private operationService: OperationService
  ) {}

  // Метод для получения счетов пользователя
  getUserAccounts(): Observable<any> {
    return this.productsService.getAccounts();
  }

  // Метод для получения карт пользователя
  getUserCards(): Observable<any> {
    return this.productsService.getCards();
  }

  // Метод для выполнения пополнения счета
  refillAccount(accountNumber: string, amount: number): Observable<any> {
    const operationData = {
      operationCode: 'AccountRefill',
      parameters: [
        { identifier: 'accountNumber', value: accountNumber },
        { identifier: 'amount', value: amount }
      ]
    };
    return this.operationService.startOperation(operationData);
  }

  // Метод для открытия нового счета
  openAccount(accountType: string, initialBalance: number): Observable<any> {
    const operationData = {
      operationCode: 'AccountOpen',
      parameters: [
        { identifier: 'accountType', value: accountType },
        { identifier: 'initialBalance', value: initialBalance }
      ]
    };
    return this.operationService.startOperation(operationData);
  }

  // Метод для заказа новой карты
  orderCard(deliveryAddress: string): Observable<any> {
    const operationData = {
      operationCode: 'CardOrder',
      parameters: [
        { identifier: 'deliveryAddress', value: deliveryAddress }
      ]
    };
    return this.operationService.startOperation(operationData);
  }

  // Метод для перевода между счетами
  transferBetweenAccounts(fromAccount: string, toAccount: string, amount: number): Observable<any> {
    const operationData = {
      operationCode: 'AccountTransfer',
      parameters: [
        { identifier: 'fromAccount', value: fromAccount },
        { identifier: 'toAccount', value: toAccount },
        { identifier: 'amount', value: amount }
      ]
    };
    return this.operationService.startOperation(operationData);
  }
  // Запуск новой операции открытия счета
  startOperation(operationData: any): Observable<any> {
    return this.operationService.startOperation(operationData);
  }

  // Выполнение следующего шага операции
  proceedOperation(requestId: string, stepData: any): Observable<any> {
    return this.operationService.proceedOperation(requestId, stepData);
  }
}

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

  getUserAccounts(): Observable<any> {
    return this.productsService.getAccounts();
  }

  getUserCards(): Observable<any> {
    return this.productsService.getCards();
  }

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

  orderCard(deliveryAddress: string): Observable<any> {
    const operationData = {
      operationCode: 'CardOrder',
      parameters: [
        { identifier: 'deliveryAddress', value: deliveryAddress }
      ]
    };
    return this.operationService.startOperation(operationData);
  }
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

  startOperation(operationData: any): Observable<any> {
    return this.operationService.startOperation(operationData);
  }

  proceedOperation(requestId: string, stepData: any): Observable<any> {
    return this.operationService.proceedOperation(requestId, stepData);
  }
  confirmOperation(operationId: string): Observable<any> {
    return this.operationService.confirmOperation(operationId);
  }
  
}

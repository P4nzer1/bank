import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { OperationService } from './operation.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';  

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

    return this.operationService.startOperation().pipe(
      switchMap(response => {
        const requestId = response.requestId;  
        return this.proceedOperation(requestId, operationData);  
      })
    );
  }

  openAccount(AccountType: string, initialBalance: number): Observable<any> {
    const operationData = {
      operationCode: 'AccountOpen',
      parameters: [
        { identifier: 'AccountType', value: AccountType },
        { identifier: 'InitialBalance', value: initialBalance.toString() }
      ]
    };

   
    return this.operationService.startOperation().pipe(
      switchMap(response => {
        const requestId = response.requestId;  
        return this.proceedOperation(requestId, operationData);  
      })
    );
  }

  orderCard(deliveryAddress: string): Observable<any> {
    const operationData = {
      operationCode: 'CardOrder',
      parameters: [
        { identifier: 'deliveryAddress', value: deliveryAddress }
      ]
    };

   
    return this.operationService.startOperation().pipe(
      switchMap(response => {
        const requestId = response.requestId; 
        return this.proceedOperation(requestId, operationData);  
      })
    );
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

    return this.operationService.startOperation().pipe(
      switchMap(response => {
        const requestId = response.requestId;  
        return this.proceedOperation(requestId, operationData);  
      })
    );
  }

  startOperation(): Observable<any> {
    return this.operationService.startOperation(); 
  }
  
  proceedOperation(requestId: string, stepData: any): Observable<any> {
    return this.operationService.proceedOperation(requestId, stepData);
  }
  
  confirmOperation(operationId: string): Observable<any> {
    return this.operationService.confirmOperation(operationId);
  }
}

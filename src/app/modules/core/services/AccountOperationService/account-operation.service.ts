import { Injectable } from '@angular/core';
import { ProductsService } from '../ProductService/products.service';
import { OperationService } from '../OperationService/operation.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';  

@Injectable({
  providedIn: 'root'
})
export class AccountOperationService {
  constructor(private productsService: ProductsService, private operationService: OperationService) {}

  getUserAccounts(): Observable<any> {
    return this.productsService.getAccounts();
  }

  getUserCards(): Observable<any> {
    return this.productsService.getCards();
  }

  refillAccount(accountNumber: string, amount: number): Observable<any> {
    const operationData = {
      parameters: [
        { identifier: 'accountNumber', value: accountNumber },
        { identifier: 'amount', value: amount }
      ]
    };

    return this.operationService.startOperation('AccountRefill').pipe(
      switchMap(response => {
        const requestId = response.requestId;
        if (requestId) {
          return this.operationService.proceedOperation(requestId, operationData); 
        } else {
          throw new Error('Request ID не получен');
        }
      })
    );
  }

  openAccount(AccountType: string, initialBalance: number): Observable<any> {
    const operationData = {
      parameters: [
        { identifier: 'AccountType', value: AccountType },
        { identifier: 'InitialBalance', value: initialBalance.toString() }
      ]
    };

    return this.operationService.startOperation('AccountOpen').pipe(
      switchMap(response => {
        const requestId = response.requestId;
        if (requestId) {
          return this.operationService.proceedOperation(requestId, operationData); 
        } else {
          throw new Error('Request ID не получен');
        }
      })
    );
  }

  orderCard(cardOrderData: { cardType: string, programType: string }): Observable<any> {
    const operationData = {
      stepParams: [
        { identifier: 'Product', value: cardOrderData.cardType }, 
        { identifier: 'ProgramType', value: cardOrderData.programType } 
      ]
    };
    return this.operationService.startOperation('CardOrder').pipe(
      switchMap(response => {
        const requestId = response.requestId;
        if (requestId) {
          return this.operationService.proceedOperation(requestId, operationData);
        } else {
          throw new Error('Request ID is missing');
        }
      })
    );
  }
  
  
  

  transferBetweenAccounts(fromAccount: string, toAccount: string, amount: number): Observable<any> {
    const operationData = {
      parameters: [
        { identifier: 'fromAccount', value: fromAccount },
        { identifier: 'toAccount', value: toAccount },
        { identifier: 'amount', value: amount }
      ]
    };

    return this.operationService.startOperation('AccountTransfer').pipe(
      switchMap(response => {
        const requestId = response.requestId;
        if (requestId) {
          return this.operationService.proceedOperation(requestId, operationData); 
        } else {
          throw new Error('Request ID не получен');
        }
      })
    );
  }

  startOperation(operationCode: string): Observable<any> {
    return this.operationService.startOperation(operationCode);
  }

  proceedOperation(requestId: string, stepData: any): Observable<any> {
    return this.operationService.proceedOperation(requestId, stepData);
  }  

  confirmOperation(operationId: string): Observable<any> {
    return this.operationService.confirmOperation(operationId);
  }
}


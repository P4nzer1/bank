import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/modules/core/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  accounts: any[] = [];
  cards: any[] = [];
  loadingAccounts = true;
  loadingCards = true;
  errorMessage = '';

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCards();
  }

  loadAccounts() {
    this.productsService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loadingAccounts = false;
      },
      error: (error) => {
        this.errorMessage = 'Ошибка при получении счетов.';
        this.loadingAccounts = false;
        console.error('Ошибка при получении счетов:', error);
      }
    });
  }

  loadCards() {
    this.productsService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
        this.loadingCards = false;
      },
      error: (error) => {
        this.errorMessage = 'Ошибка при получении карт.';
        this.loadingCards = false;
        console.error('Ошибка при получении карт:', error);
      }
    });
  }
}



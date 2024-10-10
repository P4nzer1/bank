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

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getAccounts().subscribe(data => {
      this.accounts = data;
    }, error => {
      console.error('Ошибка при получении счетов:', error);
    });

    this.productsService.getCards().subscribe(data => {
      this.cards = data;
    }, error => {
      console.error('Ошибка при получении карт:', error);
    });
  }
}


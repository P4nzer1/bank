import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { MatCardModule } from '@angular/material/card';
import { ToolbarRoutingModule } from './toolbar-routing.module'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ToolbarRoutingModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  exports: [
    ProductsComponent
  ]
})
export class ToolbarModule { }

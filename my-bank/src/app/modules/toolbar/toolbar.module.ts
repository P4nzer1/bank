import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { MatCardModule } from '@angular/material/card';
import { ToolbarRoutingModule } from './toolbar-routing.module'



@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ToolbarRoutingModule,

  ],
  exports: [
    ProductsComponent
  ]
})
export class ToolbarModule { }

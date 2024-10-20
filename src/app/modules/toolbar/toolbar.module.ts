import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ToolbarRoutingModule } from './toolbar-routing.module'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    ProductsComponent,
    HistoryComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ToolbarRoutingModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
  ],
  exports: [
    ProductsComponent,
    HistoryComponent,
    ProfileComponent,
  ]
})
export class ToolbarModule { }

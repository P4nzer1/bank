import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ConfirmationDialogComponent,
    
  ]
})
export class GeneralModule { }

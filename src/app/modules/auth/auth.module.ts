import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


import { MatCardModule } from '@angular/material/card'; 
import { AuthRoutingModule } from './auth-routing.module';


import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthChoiceComponent } from './auth-choice/auth-choice.component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    AuthChoiceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AuthRoutingModule,
    MatCardModule,
    MatSelectModule
  ],
  exports: [
    RegisterComponent,
    LoginComponent
  ]
})
export class AuthModule { }

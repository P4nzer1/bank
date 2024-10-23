import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthChoiceComponent } from './auth-choice/auth-choice.component';
import { PasswordRecoveryComponent } from './recovery/password-recovery/password-recovery.component';

const routes: Routes = [
  { path: '', component: AuthChoiceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password', component: PasswordRecoveryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

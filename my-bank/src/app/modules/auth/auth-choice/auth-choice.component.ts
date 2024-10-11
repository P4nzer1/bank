import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-choice',
  templateUrl: './auth-choice.component.html',
  styleUrls: ['./auth-choice.component.scss']
})
export class AuthChoiceComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
}


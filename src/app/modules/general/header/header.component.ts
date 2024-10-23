import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/AuthService/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.authService.removeToken();
      this.router.navigate(['/auth']);
    });
  }
  navLinks: string[] = [
  ];
  goToProducts() {
    this.router.navigate(['/toolbar/products']);
  }
}

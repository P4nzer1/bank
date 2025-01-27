import { Component } from '@angular/core';
import { AuthService } from './modules/core/services/AuthService/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public authService: AuthService) {}
  title = 'my-bank';
}

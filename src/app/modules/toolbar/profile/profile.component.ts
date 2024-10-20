import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/AuthService/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getClient().subscribe(
      (data) => {
        this.user = data; 
      },
      (error) => {
        console.error('Ошибка при получении данных клиента:', error);
      }
    );
  }
}

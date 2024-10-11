import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Инициализация формы
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Сохранение accessToken
          localStorage.setItem('authToken', response.accessToken);

          // Проверка на наличие returnUrl и редирект
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/toolbar/products';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          // Обработка ошибки авторизации
          console.error('Ошибка авторизации', error);
        }
      });
    }
  }
}


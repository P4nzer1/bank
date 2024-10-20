import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/core/services/AuthService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
      birthdate: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+7\d{10}$/)]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sex: ['', Validators.required]
      
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registrationData = this.registerForm.value;

      this.authService.register(registrationData).subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.accessToken);
          this.router.navigate(['/auth/login']);
        },
        error: (error: any) => {
          console.error('Ошибка при регистрации:', error);
          this.errorMessage = 'Ошибка при регистрации. Пожалуйста, попробуйте снова.';
        },
      });
    }
  }
}



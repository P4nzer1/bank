import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/core/services/AuthService/auth.service';
import { AbstractControl } from '@angular/forms';
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
      firstName: [
        '', 
        [Validators.required, Validators.pattern(/^[A-ZА-ЯЁ][a-zа-яё]+$/)] 
      ],
      lastName: [
        '', 
        [Validators.required, Validators.pattern(/^[A-ZА-ЯЁ][a-zа-яё]+$/)] 
      ],
      middleName: [
        '', 
        [Validators.required, Validators.pattern(/^[A-ZА-ЯЁ][a-zа-яё]+$/)] 
      ],
      birthdate: [
        '', 
        [Validators.required, this.ageValidator(18)] 
      ],
      login: [
        '', 
        [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9]+$/)] 
      ],
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8), 
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]
      ],
      phoneNumber: [
        '', 
        [Validators.required, Validators.pattern(/^\+7\d{10}$/)] 
      ],
      address: [
        '', 
        [Validators.required, Validators.pattern(/^(?=.*[0-9])[^\s]+$/), Validators.minLength(10)] 
      ],
      email: [
        '', 
        [Validators.required, Validators.email] 
      ],
      sex: [
        '', 
        [Validators.required] 
      ]
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
  ageValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const birthdate = new Date(control.value);
      if (isNaN(birthdate.getTime())) {
        return { invalidDate: true }; 
      }
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      const monthDiff = today.getMonth() - birthdate.getMonth();
      const dayDiff = today.getDate() - birthdate.getDate();
      
      if (
        age > minAge || 
        (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
      ) {
        return null; 
      }
      return { tooYoung: true }; 
    };
  } 

  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control?.valid || false;
  }
}



import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/core/services/AuthService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
  recoveryForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recoveryForm = this.fb.group({
      login: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.recoveryForm.valid) {
      const newPasswordData = this.recoveryForm.value;

      this.authService.updatePassword(newPasswordData).subscribe({
        next: () => {
          this.successMessage = 'Пароль успешно обновлен!';
          this.router.navigate(['/auth/login']);
        },
        error: (error: any) => {
          console.error('Ошибка при восстановлении пароля:', error);
          this.errorMessage = 'Ошибка при восстановлении пароля. Пожалуйста, попробуйте снова.';
        }
      });
    }
  }
}

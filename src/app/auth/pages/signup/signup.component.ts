import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  role = 'STAFF';
  errorMessage = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onSubmit(): void {
    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.signup();
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private readonly AUTH_KEY = 'is_logged_in';

  constructor(private readonly router: Router) {}

  login(): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
  }

  signup(): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
}

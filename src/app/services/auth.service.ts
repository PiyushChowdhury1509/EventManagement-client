import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private email: string | null = null;

  constructor() {
    const stored = localStorage.getItem('auth_email');
    if (stored) this.email = stored;
  }

  setEmail(email: string): void {
    this.email = email;
    localStorage.setItem('auth_email', email);
  }

  getEmail(): string | null {
    return this.email;
  }

  isAdmin(): boolean {
    return (this.email || '').toLowerCase() === 'admin@gmail.com';
  }

  logout(): void {
    this.email = null;
    localStorage.removeItem('auth_email');
  }
}




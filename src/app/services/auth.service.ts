import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private email: string | null = null;
  private token: string | null = null;
  private name: string | null = null;
  private role: string | null = null;
  private authStateSubject = new BehaviorSubject<boolean>(false);
  authState$ = this.authStateSubject.asObservable();
  private logoutUrl = 'http://localhost:3000/api/v1/user/logout';

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('auth_email');
    if (stored) this.email = stored;

    try {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        this.name = parsed?.data?.name || parsed?.name || this.name;
        this.role = parsed?.data?.role || parsed?.role || this.role;
        const emailFromUser = parsed?.data?.email || parsed?.email;
        if (emailFromUser && !this.email) this.email = emailFromUser;
      }
    } catch {}

    const storedRole = localStorage.getItem('user_role');
    if (storedRole) this.role = storedRole;

    this.token = this.readAuthCookie();
    this.emitAuthState();
  }

  setEmail(email: string): void {
    this.email = email;
    localStorage.setItem('auth_email', email);
  }

  setToken(token: string): void {
    this.token = token;
  }

  setName(name: string): void {
    this.name = name;
    try {
      localStorage.setItem('user_name', name);
    } catch {}
  }

  setRole(role: string | null | undefined): void {
    if (!role) return;
    this.role = role;
    try {
      localStorage.setItem('user_role', role);
    } catch {}
  }

  setUser(user: { email?: string; name?: string; role?: string }): void {
    if (user.email) this.setEmail(user.email);
    if (user.name) this.setName(user.name);
    if (user.role) this.setRole(user.role);
    this.refreshAuthState();
  }

  getEmail(): string | null {
    return this.email;
  }

  getToken(): string | null {
    return this.token;
  }

  getName(): string | null {
    return this.name;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  refreshAuthState(): void {
    this.token = this.readAuthCookie();
    this.emitAuthState();
  }

  private emitAuthState(): void {
    this.authStateSubject.next(!!this.token);
  }

  isAdmin(): boolean {
    return (this.role || '').toLowerCase() === 'admin';
  }

  getUserRole(): string {
    if (!this.token) return 'user';

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload.role || 'user';
    } catch (error) {
      console.error('Error decoding token:', error);
      return 'user';
    }
  }

  logout(): void {
    this.http.post(this.logoutUrl, {}, { withCredentials: true }).subscribe({
      complete: () => this.flushLocalAuth(),
      error: () => this.flushLocalAuth(),
    });
  }

  private flushLocalAuth(): void {
    this.email = null;
    this.token = null;
    this.name = null;
    this.role = null;
    localStorage.removeItem('auth_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('auth_user');
    this.deleteCookie('token');
    this.deleteCookie('auth_token');
    this.deleteCookie('jwt');
    this.emitAuthState();
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  private readAuthCookie(): string | null {
    return (
      this.getCookie('token') ||
      this.getCookie('auth_token') ||
      this.getCookie('jwt') ||
      null
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    // React to auth state changes
    this.authService.authState$.subscribe(() => {
      this.checkAuthStatus();
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
      });
  }

  checkAuthStatus(): void {
    const user = this.authService;
    this.userName = user.getName() || localStorage.getItem('user_name') || '';
    // Logged-in is based on token presence
    this.isLoggedIn = user.isAuthenticated();
    this.isAdmin = user.isAdmin();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.isAdmin = false;
    this.router.navigate(['/notice']);
  }

  getDisplayName(): string {
    if (!this.userName) return '';
    return this.userName;
  }
}

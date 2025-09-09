import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userEmail = '';
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    
    // Listen for route changes to refresh auth status
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
      });
  }

  checkAuthStatus(): void {
    this.userEmail = this.authService.getEmail() || '';
    this.isLoggedIn = !!this.userEmail;
    this.isAdmin = this.authService.isAdmin();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userEmail = '';
    this.isAdmin = false;
    this.router.navigate(['/notice']);
  }

  getDisplayName(): string {
    if (!this.userEmail) return '';
    return this.userEmail.split('@')[0];
  }
}

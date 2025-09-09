import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAdmin = this.authService.isAdmin();
    
    if (isAdmin) {
      return true;
    } else {
      // Redirect to login page if not admin
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: state.url,
          message: 'Admin access required' 
        } 
      });
      return false;
    }
  }
}


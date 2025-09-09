import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = '/notice';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/notice'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/notice';
    this.message = this.route.snapshot.queryParams['message'] || '';
    
    // Redirect if already logged in
    if (this.authService.getEmail()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  submit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      // Simple authentication logic - in real app, this would call an API
      if (email && password) {
        this.authService.setEmail(email);
        
        // Check if user is trying to access admin routes
        if (this.returnUrl.includes('create-event') || this.returnUrl.includes('form-builder')) {
          if (!this.authService.isAdmin()) {
            this.message = 'Admin access required for this page';
            this.returnUrl = '/notice';
          }
        }
        
        this.router.navigate([this.returnUrl]);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}

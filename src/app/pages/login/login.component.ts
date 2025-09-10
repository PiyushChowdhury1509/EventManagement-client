import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = '/notice';
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/notice';
    this.message = this.route.snapshot.queryParams['message'] || '';
    if (this.authService.getEmail()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  submit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.http
        .post(
          'http://localhost:3000/api/v1/user/signin',
          { email, password },
          { withCredentials: true }
        )
        .subscribe({
          next: (response: any) => {
            console.log('Login successful:', response);
            this.isLoading = false;
            const userEmail = response?.data?.email || response?.email || email;
            this.authService.setUser({
              email: userEmail,
              name: response?.data?.name || response?.name,
              role: response?.data?.role || response?.role,
              id: response?.data?._id || response?._id,
            });
            try {
              localStorage.setItem('auth_user', JSON.stringify(response));
              if (response?.data?.role || response?.role) {
                localStorage.setItem(
                  'user_role',
                  response?.data?.role || response?.role
                );
              }
            } catch {}
            this.authService.refreshAuthState();
            this.snackBar.open('Login successful!', 'Close', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
            if (
              this.returnUrl.includes('create-event') ||
              this.returnUrl.includes('create-notice')
            ) {
              const role = (
                response?.data?.role ||
                response?.role ||
                ''
              ).toLowerCase();
              const isAdmin = role === 'admin';
              if (!isAdmin) {
                this.message = 'Admin access required for this page';
                this.returnUrl = '/notice';
              }
            }
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 1000);
          },
          error: (error) => {
            console.error('Login failed:', error);
            this.isLoading = false;
            this.authService.refreshAuthState();

            const message =
              error?.error?.message ||
              'Login failed. Please check your credentials.';
            this.snackBar.open(message, 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  fillDemoCredentials(isAdmin: boolean = false): void {
    if (isAdmin) {
      this.loginForm.patchValue({
        email: 'ad@gmail.com',
        password: 'strong',
      });
    } else {
      this.loginForm.patchValue({
        email: 'st@gmail.com',
        password: 'strong',
      });
    }
  }
}

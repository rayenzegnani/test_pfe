import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../service/UserService';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  userService = inject(UserService);
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  loginType: 'user' | 'admin' = 'user';  // Default to user login

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const loginData = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    const rememberMe = this.loginForm.get('rememberMe')?.value;

    console.log('Attempting login:', { email: loginData.email, loginType: this.loginType });

    this.userService.loginUser(loginData).subscribe({
      next: (result: any) => {
        console.log('Login successful:', result);
        this.isLoading = false;

        this.successMessage = result.message || 'Login successful! Redirecting...';
        
        // Store user data in localStorage
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          localStorage.setItem('loginType', this.loginType);
          
          // Handle "Remember Me" functionality
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', loginData.email);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userEmail');
          }
        }

        // Navigate based on user role
        setTimeout(() => {
          console.log('User data:', result.user);
          console.log('User role:', result.user?.role);
          console.log('User isAdmin:', result.user?.isAdmin);
          
          const isUserAdmin = result.user?.role === true || result.user?.isAdmin === true;
          console.log('Is user admin?', isUserAdmin);
          
          if (this.loginType === 'admin') {
            if (isUserAdmin) {
              console.log('Navigating to admin dashboard...');
              this.router.navigate(['/admin/category']);
            } else {
              console.log('Admin access denied - user account cannot login as admin');
              this.errorMessage = 'Access denied. You do not have administrator privileges.';
              localStorage.clear();
            }
          } else {
            // User login - check that they're NOT an admin
            if (isUserAdmin) {
              console.log('User login denied - admin account cannot login as user');
              this.errorMessage = 'Please use the Admin login for administrator accounts.';
              localStorage.clear();
            } else {
              console.log('Navigating to home page...');
              this.router.navigate(['/']);
            }
          }
        }, 1000);
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Please enter valid credentials.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the backend is running on http://localhost:3000';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again later.';
        }
      }
    });
  }
}

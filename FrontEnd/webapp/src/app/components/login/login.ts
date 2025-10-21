import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

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

    const loginData = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value
    };

    // TODO: Replace with actual authentication service call
    // Example:
    // this.authService.login(loginData).subscribe({
    //   next: (response) => {
    //     this.isLoading = false;
    //     // Store token, user data, etc.
    //     this.router.navigate(['/']);
    //   },
    //   error: (error) => {
    //     this.isLoading = false;
    //     this.errorMessage = error.error?.message || 'Invalid email or password';
    //   }
    // });

    // Temporary simulation (remove when implementing real authentication)
    setTimeout(() => {
      this.isLoading = false;
      
      // Simulate successful login
      if (loginData.email === 'admin@example.com' && loginData.password === 'password') {
        console.log('Login successful:', loginData);
        this.router.navigate(['/admin/category']);
      } else {
        this.errorMessage = 'Invalid email or password. Try: admin@example.com / password';
      }
    }, 1500);
  }
}

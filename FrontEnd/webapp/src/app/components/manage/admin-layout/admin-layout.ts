import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout implements OnInit {
  currentRoute: string = '';
  userName: string = '';
  userEmail: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userName = user.nom || 'Admin';
      this.userEmail = user.email || '';
    }

    // Track route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  getPageTitle(): string {
    const route = this.currentRoute;
    if (route.includes('/admin/category')) {
      if (route.includes('/add')) return 'Add Category';
      if (route.match(/\/admin\/category\/[^/]+$/)) return 'Edit Category';
      return 'Categories Management';
    }
    if (route.includes('/admin/products')) return 'Products Management';
    if (route.includes('/admin/income')) return 'Income & Analytics';
    if (route.includes('/admin/users')) return 'Users Management';
    if (route.includes('/admin/settings')) return 'Settings';
    if (route.includes('/admin/dashboard')) return 'Dashboard';
    return 'Admin Panel';
  }

  getPageDescription(): string {
    const route = this.currentRoute;
    if (route.includes('/admin/category')) {
      if (route.includes('/add')) return 'Create a new category';
      if (route.match(/\/admin\/category\/[^/]+$/)) return 'Update category information';
      return 'Manage product categories';
    }
    if (route.includes('/admin/products')) return 'Manage your products inventory';
    if (route.includes('/admin/income')) return 'View sales and revenue data';
    if (route.includes('/admin/users')) return 'Manage user accounts';
    if (route.includes('/admin/settings')) return 'Configure application settings';
    if (route.includes('/admin/dashboard')) return 'Overview of your business';
    return 'Welcome to the administration panel';
  }

  getUserName(): string {
    return this.userName || 'Admin';
  }

  getUserInitials(): string {
    const name = this.userName || 'Admin';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('loginType');
      
      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }
}

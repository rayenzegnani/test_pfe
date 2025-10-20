import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('webapp');
   isLoggedIn = false; // Set to true if user is logged in
  userName = 'John Doe';
  
  // Cart data
  cartItemsCount = 3;
  
  // Stats data
  totalOrders = 12;
  wishlistCount = 8;
  activeCoupons = 2;
  loyaltyPoints = 450;
  
  // Featured products
  featuredProducts = [
    {
      id: 1,
      name: 'Smartphone Pro',
      price: 799.99,
      image: 'assets/images/product1.jpg'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 199.99,
      image: 'assets/images/product2.jpg'
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 299.99,
      image: 'assets/images/product3.jpg'
    },
    {
      id: 4,
      name: 'Laptop Ultra',
      price: 1299.99,
      image: 'assets/images/product4.jpg'
    }
  ];
  
  // Recent orders
  recentOrders = [
    {
      id: 'ORD-001',
      date: new Date('2024-01-15'),
      total: 156.78,
      status: 'delivered'
    },
    {
      id: 'ORD-002',
      date: new Date('2024-01-14'),
      total: 89.99,
      status: 'shipped'
    },
    {
      id: 'ORD-003',
      date: new Date('2024-01-12'),
      total: 234.50,
      status: 'processing'
    }
  ];

  // Methods
  addToCart(product: any) {
    console.log('Adding to cart:', product);
    // Implement add to cart logic
    this.cartItemsCount++;
  }

  logout() {
    console.log('Logging out...');
    // Implement logout logic
    this.isLoggedIn = false;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'delivered': 'bg-green-100 text-green-800',
      'shipped': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
}


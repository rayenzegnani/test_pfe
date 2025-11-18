import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../service/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);

  cartItems: CartItem[] = [];
  isLoggedIn = false;
  userName = '';

  ngOnInit(): void {
    this.checkLoginStatus();
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!token;
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.userName = userData.nom || userData.email || 'User';
      } catch (e) {
        this.userName = 'User';
      }
    }
  }

  getTotal(): number {
    return this.cartService.getCartTotal();
  }

  getProductImage(product: any): string {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return 'https://via.placeholder.com/300x400?text=No+Image';
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  checkout(): void {
    if (!this.isLoggedIn) {
      alert('Please login to proceed with checkout');
      this.router.navigate(['/login']);
    } else {
      // Navigate to checkout page (to be implemented)
      alert('Checkout feature coming soon!');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginType');
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/login']);
  }
}

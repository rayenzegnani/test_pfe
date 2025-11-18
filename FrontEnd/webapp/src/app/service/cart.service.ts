import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  constructor() {
    this.loadCartFromStorage();
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = item.product.purchagePrice || 0;
      const discount = item.product.discount || 0;
      const finalPrice = price - (price * discount / 100);
      return total + (finalPrice * item.quantity);
    }, 0);
  }

  addToCart(product: any, quantity: number = 1): void {
    const userId = this.getUserId();
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }

    this.saveCartToStorage(userId);
    this.cartSubject.next(this.cartItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    const userId = this.getUserId();
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCartToStorage(userId);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  removeFromCart(productId: string): void {
    const userId = this.getUserId();
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage(userId);
    this.cartSubject.next(this.cartItems);
  }

  clearCart(): void {
    const userId = this.getUserId();
    this.cartItems = [];
    this.saveCartToStorage(userId);
    this.cartSubject.next(this.cartItems);
  }

  private getUserId(): string {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || userData.userId || 'guest';
      } catch (e) {
        return 'guest';
      }
    }
    return 'guest';
  }

  private saveCartToStorage(userId: string): void {
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
  }

  private loadCartFromStorage(): void {
    const userId = this.getUserId();
    const cartKey = `cart_${userId}`;
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next(this.cartItems);
      } catch (e) {
        console.error('Error loading cart from storage:', e);
        this.cartItems = [];
      }
    }
  }
}

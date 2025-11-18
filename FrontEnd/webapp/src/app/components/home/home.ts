import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../service/product';
import { CategoriesService } from '../../service/categories';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  cartItemsCount = 0;
  products: any[] = [];
  categories: any[] = [];
  isLoggedIn = false;
  userName = '';

  productService = inject(ProductService);
  categoriesService = inject(CategoriesService);
  cartService = inject(CartService);
  router = inject(Router);

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadProducts();
    this.loadCategories();
    this.updateCartCount();
  }

  private updateCartCount(): void {
    this.cartService.getCart().subscribe(() => {
      this.cartItemsCount = this.cartService.getCartCount();
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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginType');
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/login']);
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        // Map the product data to include proper image URL and price formatting
        this.products = data.map((product: any) => ({
          ...product,
          image: product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/400x300?text=No+Image',
          price: `$${product.purchagePrice || 0}`,
          category: product.categoryId || 'Uncategorized'
        }));
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  addToCart(product: any) {
    console.log('Adding to cart:', product);
    this.cartService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  }
}


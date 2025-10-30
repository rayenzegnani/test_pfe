import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { CategoriesService } from '../../service/categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  cartItemsCount = 1;
  products: any[] = [];
  categories: any[] = [];

  productService = inject(ProductService);
  categoriesService = inject(CategoriesService);

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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
    this.cartItemsCount++;
  }
}


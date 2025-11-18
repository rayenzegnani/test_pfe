import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../service/product';
import { CategoriesService } from '../../service/categories';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collections.html',
  styleUrls: ['./collections.scss']
})
export class Collections implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoriesService);
  cartService = inject(CartService);

  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'all';
  isLoading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.filteredProducts = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.categoryId === categoryId
      );
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
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

  addToCart(product: any): void {
    this.cartService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  }
}

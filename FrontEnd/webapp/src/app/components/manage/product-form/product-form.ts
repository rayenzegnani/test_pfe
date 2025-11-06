import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../service/product';
import { CategoriesService } from '../../../service/categories';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  categories: any[] = [];
  imageUrls: string[] = [];
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      purchagePrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      categoryId: [[], Validators.required],
      images: [[]],
      isFeatured: [false],
      isNewProduct: [false]
    });

    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        if (this.productId) {
          this.loadProduct(this.productId);
        }
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          purchagePrice: product.purchagePrice,
          discount: product.discount,
          categoryId: product.categoryId,
          images: product.images || [],
          isFeatured: product.isFeatured,
          isNewProduct: product.isNewProduct
        });
        // Load existing images for preview
        if (product.images && product.images.length > 0) {
          this.imagePreviewUrls = [...product.images];
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        alert('Failed to load product');
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(files);
      this.selectedFiles.push(...newFiles);

      // Create preview URLs for new images
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  addImageUrl(): void {
    const urlInput = prompt('Enter image URL:');
    if (urlInput && urlInput.trim()) {
      this.imagePreviewUrls.push(urlInput.trim());
      const currentImages = this.productForm.get('images')?.value || [];
      this.productForm.patchValue({
        images: [...currentImages, urlInput.trim()]
      });
    }
  }

  removeImage(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    if (index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }
    // Update form value
    const currentImages = this.productForm.get('images')?.value || [];
    currentImages.splice(index, 1);
    this.productForm.patchValue({ images: currentImages });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    const productData = this.productForm.value;
    
    // Add image URLs to product data
    productData.images = this.imagePreviewUrls;

    if (this.isEditMode && this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.router.navigate(['/admin/product']);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          alert('Failed to update product');
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(productData).subscribe({
        next: () => {
          alert('Product added successfully');
          this.router.navigate(['/admin/product']);
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Failed to add product');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/product']);
  }
}

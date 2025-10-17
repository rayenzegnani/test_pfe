import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [  CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm {
    categoryForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      status: ['active', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
      formData.append('description', this.categoryForm.get('description')?.value);
      formData.append('status', this.categoryForm.get('status')?.value);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Simulate API call
      setTimeout(() => {
        console.log('Category data:', {
          name: this.categoryForm.value.name,
          description: this.categoryForm.value.description,
          status: this.categoryForm.value.status,
          file: this.selectedFile?.name
        });
        
        this.isSubmitting = false;
        
        // Navigate back to categories list or show success message
        this.router.navigate(['/categories']);
      }, 1500);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WEBP)');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }
}

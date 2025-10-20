import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../service/categories';
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
  name: string = '';
    categoryForm: FormGroup;
  isSubmitting = false;
  categoryService= inject(CategoriesService);
  IsEditMode=false;
  categoryId: string | null = null;
  route=inject(ActivatedRoute);
    ngOnInit() {
      // subscribe to paramMap so we handle route reuse and dynamic params
      this.route.paramMap.subscribe((pm) => {
        const id = pm.get('id');
        this.categoryId = id;
        if (id) {
          this.IsEditMode = true;
          this.categoryService.getCategoriesById(id).subscribe((data: any) => {
            console.log(data);
            this.categoryForm.patchValue({ name: data?.name ?? '' });
          });
        } else {
          this.IsEditMode = false;
          this.categoryForm.reset();
        }
      });
    }

    
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],

    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
    
      
   
     const categoryData = { name: this.categoryForm.get('name')?.value };
     this.categoryService.createCategory(categoryData).subscribe((result:any)=>{
      alert('Category created successfully!');
      console.log('Category created:', result);
     });
      setTimeout(() => {
        console.log('Category data:', {
          name: this.categoryForm.value.name,

        });
        
        this.isSubmitting = false;
        
        // Navigate back to categories list or show success message
        this.router.navigate(['/admin/category']);
      }, 1500);
    }
    
  }

    Update(){
    // ensure we have an id (try stored value, then route snapshot)
    let id = this.categoryId ?? this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Cannot update category: missing id');
      alert('Update failed: missing category id');
      return;
    }

    const categoryData = { id: id, name: this.categoryForm.get('name')?.value };
    // call update and handle errors
    this.categoryService.UpdateCategory(categoryData).subscribe({
      next: (result:any) => {
        alert('Category updated successfully!');
        console.log('Category updated:', result);
        this.router.navigate(['/admin/category']);
      },
      error: (err:any) => {
        console.error('Update request failed', err);
        alert('Update failed: ' + (err?.error?.error || err?.message || 'Unknown error'));
      }
    });
 
  }
   
     
  

  


  oncancel(){
    this.router.navigate(['/admin/category']);
  }


}

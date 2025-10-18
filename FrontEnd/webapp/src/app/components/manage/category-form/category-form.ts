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
  route=inject(ActivatedRoute);
    ngOnInit() {
      let id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.IsEditMode=true;
        this.categoryService.getCategoriesById(id).subscribe((data:any)=>{
        console.log(data);
          });
        }
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
    
      
   
     this.categoryService.createCategory(formData).subscribe((result:any)=>{
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



  onCancel() {
    this.router.navigate(['/admin/category']);
  }

}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../categories.component';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.css'
})
export class CategoriesFormComponent implements OnInit {

  categoryForm: FormGroup;

  isEditMode = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {

    // Create category form
    this.categoryForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],

      description: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  ngOnInit(): void {

    // Get category ID from URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.categoryId = Number(id);
      this.isEditMode = true;
    }

    // Load category when editing
    if (this.isEditMode && this.categoryId) {

      this.categoryService
        .getCategoryById(this.categoryId)
        .subscribe({

          next: (category: Category) => {

            // Put existing category data into the form
            this.categoryForm.patchValue({
              name: category.name,
              description: category.description
            });

          },

          error: (error) => {
            console.error('Error loading category:', error);
          }

        });
    }
  }

  // Create data to send to API
  private buildPayload(): Omit<Category, 'id' | 'created_at'> {

    const formValue = this.categoryForm.value;

    const payload = {
      name: formValue.name,
      description: formValue.description
    };

    return payload;
  }

  onSubmit(): void {

    // Check form validation
    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;
    }

    // Get data to send to API
    const payload = this.buildPayload();

    // Update category
    if (this.isEditMode && this.categoryId) {

      this.categoryService
        .updateCategory(this.categoryId, payload)
        .subscribe({

          next: () => {

            // Reset form
            this.categoryForm.reset({
              name: '',
              description: ''
            });

            // Go to category list
            this.router.navigate(['/categories']);
          },

          error: (error) => {
            console.error('Error updating category:', error);
          }

        });

      return;
    }

    // Add category
    this.categoryService
      .addCategory(payload)
      .subscribe({

        next: () => {

          // Reset form
          this.categoryForm.reset({
            name: '',
            description: ''
          });

          // Go to category list
          this.router.navigate(['/categories']);
        },

        error: (error) => {
          console.error('Error adding category:', error);
        }

      });
  }

  // Go back to category list
  cancel(): void {

    this.categoryForm.reset({
      name: '',
      description: ''
    });

    this.router.navigate(['/categories']);
  }
}
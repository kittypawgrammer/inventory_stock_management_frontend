import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-suplier-form',
  templateUrl: './suplier-form.component.html',
  styleUrl: './suplier-form.component.css'
})
export class SuplierFormComponent implements OnInit {

  supplierForm: FormGroup;

  isEditMode = false;
  supplierId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {
    // Create supplier form
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact_email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    // Get supplier ID from URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.supplierId = Number(id);
      this.isEditMode = true;
    }

    // Load supplier when editing
    if (this.isEditMode && this.supplierId) {

      this.supplierService.getSupplierById(this.supplierId).subscribe({
        next: (supplier) => {

          this.supplierForm.patchValue({
            name: supplier.name,
            contact_email: supplier.contact_email,
            phone: supplier.phone,
            address: supplier.address
          });

        },
        error: (error) => {
          console.error('Error loading supplier:', error);
        }
      });
    }
  }

  onSubmit(): void {

    // Check form validation
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    // Get form data
    const formValue = this.supplierForm.value;

    // Data sent to API
    const payload = {
      name: formValue.name,
      contact_email: formValue.contact_email,
      phone: formValue.phone,
      address: formValue.address
    };

    // Update supplier
    if (this.isEditMode && this.supplierId) {

      this.supplierService
        .updateSupplier(this.supplierId, payload)
        .subscribe({
          next: () => {
            this.router.navigate(['/suppliers']);
          },
          error: (error) => {
            console.error('Error updating supplier:', error);
          }
        });

      return;
    }

    // Add supplier
    this.supplierService.addSupplier(payload).subscribe({
      next: () => {
        this.router.navigate(['/suppliers']);
      },
      error: (error) => {
        console.error('Error adding supplier:', error);
      }
    });
  }

  // Go back to supplier list
  cancel(): void {
    this.router.navigate(['/suppliers']);
  }
}


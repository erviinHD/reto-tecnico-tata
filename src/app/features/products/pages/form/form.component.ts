import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { CommonModule } from '@angular/common';
import {
  realeseDate,
  reviewDate,
} from '../../../../shared/validators/date-validators';

@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessagesComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  private _toast = inject(ToastService);
  private _productsService = inject(ProductsService);
  private _router = inject(Router);

  isEdit: boolean = false;
  loading: boolean = true;
  productId?: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEdit = !!this.productId;

    if (this.isEdit) {
      this.loadProduct();
    }

    this.form
      .get('date_release')
      ?.setValidators([Validators.required, realeseDate()]);

    const dateReleaseControl = this.form.get('date_release');
    if (dateReleaseControl) {
      this.form
        .get('date_revision')
        ?.setValidators([Validators.required, reviewDate(dateReleaseControl)]);
    }

    this.form.updateValueAndValidity();
  }

  loadProduct() {
    this.loading = true;
    this._productsService.getProductById(this.productId!).subscribe({
      next: (product) => {
        this.form.patchValue(product);
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this._router.navigate([]);
      },
    });
  }

  sendProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit) {
      this.editProduct();
    } else {
      this.createProduct();
    }
  }

  editProduct() {
    this._productsService.updateProduct(this.form.value).subscribe({
      next: () => {
        this._toast.success('Producto actualizado correctamente');
      },
      error: (e) => {
        this._toast.error(e.error.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.goForm();
      },
    });
  }

  createProduct() {
    this._productsService.createProduct(this.form.value).subscribe({
      next: () => {
        this._toast.success('Producto creado correctamente');
      },
      error: (e) => {
        this._toast.error(e.error.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.goForm();
      },
    });
  }

  checkID(productId: string) {
    if (!productId) {
      return;
    }
    
    this._productsService.validationProduct(productId).subscribe({
      next: (isValid) => {
        if (!isValid) {
          this.form.get('id')?.setErrors({ invalidId: 'ID no válido!' });
        } else {
          this.form.get('id')?.setErrors(null);
        }
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  resetForm() {
    this.form.reset();
  }

  goForm(route: string = '') {
    this._router.navigate([route]);
  }
}

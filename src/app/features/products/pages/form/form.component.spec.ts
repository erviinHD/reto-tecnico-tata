import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

const mockProduct = {
  id: '443',
  name: 'Nombre producto seis',
  description: 'Descripción producto seis',
  logo: 'https://pixabay.com/images/search/user%20icon/',
  date_release: new Date(),
  date_revision: new Date(),
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProductById',
      'createProduct',
      'updateProduct',
      'validationProduct',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    productsServiceSpy.getProductById.and.returnValue(
      of({
        data: mockProduct,
        success: true,
        message: 'ok',
      }),
    );

    productsServiceSpy.createProduct.and.returnValue(of(mockProduct));
    productsServiceSpy.updateProduct.and.returnValue(of(mockProduct));
    productsServiceSpy.validationProduct.and.returnValue(
      of({
        data: false,
        success: true,
        message: 'ID inválido',
      }),
    );

    await TestBed.configureTestingModule({
      imports: [FormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null, // modo create por defecto
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create y tener el formulario inicializado', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  it('no debe cargar producto si no hay id (modo create)', () => {
    expect(productsServiceSpy.getProductById).not.toHaveBeenCalled();
    expect(component.isEdit).toBeFalse();
  });

  it('debe cargar producto en modo edit', () => {
    productsServiceSpy.getProductById.calls.reset();

    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          paramMap: {
            get: () => '443',
          },
        },
      },
    });

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEdit).toBeTrue();
    expect(productsServiceSpy.getProductById).toHaveBeenCalledWith('443');
    expect(component.form.value.id).toBe('443');
  });

  it('sendProduct no debe enviar si el formulario es inválido', () => {
    component.form.patchValue({ name: '' });

    spyOn(component.form, 'markAllAsTouched');

    component.sendProduct();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(productsServiceSpy.createProduct).not.toHaveBeenCalled();
  });

  it('sendProduct debe crear producto en modo create', () => {
    component.isEdit = false;

    component.form.setValue({
      id: '443',
      name: 'Producto válido',
      description: 'Descripción suficientemente larga',
      logo: 'logo.png',
      date_release: new Date(),
      date_revision: new Date(),
    });

    component.form.updateValueAndValidity();

    component.sendProduct();

    expect(productsServiceSpy.createProduct).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalled();
  });

  it('sendProduct debe actualizar producto en modo edit', () => {
    component.isEdit = true;
    component.form.patchValue(mockProduct);

    component.sendProduct();

    expect(productsServiceSpy.updateProduct).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalled();
  });

  it('goForm debe navegar correctamente', () => {
    component.goForm('/products');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });
});

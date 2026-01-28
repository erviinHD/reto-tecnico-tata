import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { of, throwError } from 'rxjs';

const mockProducts = [
  {
    id: 'cuatro',
    name: 'Nombre producto cuatro',
    description: 'Descripción producto cuatro',
    logo: 'https://pixabay.com/images/search/user%20icon/',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: 'cinco',
    name: 'Nombre producto cinco',
    description: 'Descripción producto cinco',
    logo: 'https://pixabay.com/images/search/user%20icon/',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: 'xx',
    name: 'Nombre producto seis',
    description: 'Descripción producto seis',
    logo: 'https://pixabay.com/images/search/user%20icon/',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '2323',
    name: 'Nombre producto seis',
    description: 'Descripción producto seis',
    logo: 'https://pixabay.com/images/search/user%20icon/',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '443',
    name: 'Nombre producto seis',
    description: 'Descripción producto seis',
    logo: 'https://pixabay.com/images/search/user%20icon/',
    date_release: new Date(),
    date_revision: new Date(),
  },
];

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProducts',
      'deletProduct',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    productsServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productsServiceSpy.deletProduct.and.returnValue(of(mockProducts[0]));

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar productos en ngOnInit', () => {
    expect(productsServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(5);
    expect(component.visibleProducts.length).toBe(component.itemsPerPage);
  });

  it('debe abrir el dialog de eliminación', () => {
    component.openDeleteDialog(mockProducts[0]);

    expect(component.productById).toEqual(mockProducts[0]);
    expect(component.showDialog).toBeTrue();
  });

  it('debe eliminar producto y mostrar toast', () => {
    component.productById = mockProducts[0];

    component.deleteProduct();

    expect(productsServiceSpy.deletProduct).toHaveBeenCalledWith('cuatro');
    expect(toastSpy.success).toHaveBeenCalled();
  });

  it('debe navegar al formulario sin id', () => {
    component.goForm('/products/create');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/create']);
  });

  it('debe navegar al formulario con id', () => {
    component.goForm('/products/edit', 'cuatro');

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/products/edit',
      'cuatro',
    ]);
  });

  it('debe cerrar el dropdown al hacer click fuera', () => {
    component.openedDropdownId = '1';

    component.handleClickOutside(new Event('click'));

    expect(component.openedDropdownId).toBeNull();
  });
});

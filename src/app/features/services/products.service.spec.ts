import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { ApiService } from '../../core/services/api.service';
import { ProductInterface } from '../products/interfaces/product.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService, ApiService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockProducts: ProductInterface[] = [
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
  ];

  it('debe obtener la lista de productos', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne((req) => req.url.includes('/bp/products'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('debe obtener un producto por id', () => {
    const product = mockProducts[0];

    const mockResponse = {
      data: product,
      success: true,
      message: 'Producto encontrado',
    };

    service.getProductById('1').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((req) => req.url.includes('/bp/products/1'));

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('debe crear un producto', () => {
    const newProduct: ProductInterface = {
      id: '43434',
      name: 'Nombre producto seis',
      description: 'Descripción producto seis',
      logo: 'https://pixabay.com/images/search/user%20icon/',
      date_release: new Date(),
      date_revision: new Date(),
    };

    service.createProduct(newProduct).subscribe((res) => {
      expect(res).toEqual(newProduct);
    });

    const req = httpMock.expectOne((req) => req.url.includes('/bp/products'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);

    req.flush(newProduct);
  });

  it('debe actualizar un producto', () => {
    const updatedProduct = { ...mockProducts[0], name: 'test' };

    service.updateProduct(updatedProduct).subscribe((res) => {
      expect(res.name).toBe('test');
    });

    const req = httpMock.expectOne((req) =>
      req.url.includes('/bp/products/' + updatedProduct.id),
    );
    expect(req.request.method).toBe('PUT');

    req.flush(updatedProduct);
  });

  it('debe eliminar un producto', () => {
    service.deletProduct('1').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne((req) => req.url.includes('/bp/products/1'));
    expect(req.request.method).toBe('DELETE');

    req.flush(true);
  });
});

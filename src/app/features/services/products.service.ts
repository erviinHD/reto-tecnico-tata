import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { ProductInterface } from '../products/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private api: ApiService) {}

  getProducts() {
    return this.api.get<ProductInterface[]>('').pipe(map((res) => res.data));
  }

  getProductById(product_id: string) {
    return this.api.get<ProductInterface>(product_id).pipe(map((res) => res));
  }

  validationProduct(product_id: string) {
    return this.api
      .get<boolean>('verification/' + product_id)
      .pipe(map((res) => res));
  }

  createProduct(product: ProductInterface) {
    return this.api.post<ProductInterface>('', product).pipe(map((res) => res));
  }

  updateProduct(product: ProductInterface) {
    return this.api
      .put<ProductInterface>(product.id, product)
      .pipe(map((res) => res));
  }

  deletProduct(product_id: string) {
    return this.api
      .delete<ProductInterface>(product_id)
      .pipe(map((res) => res));
  }
}

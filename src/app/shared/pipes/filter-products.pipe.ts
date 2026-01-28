import { Pipe, PipeTransform } from '@angular/core';
import { ProductInterface } from '../../features/products/interfaces/product.interface';

@Pipe({
  name: 'filterProducts',
})
export class FilterProductsPipe implements PipeTransform {
  transform(
    products: ProductInterface[],
    searchText: string,
  ): ProductInterface[] {
    if (!products || !searchText) return products;

    const text = searchText.toLowerCase().trim();

    return products.filter((product) =>
      product.name.toLowerCase().includes(text),
    );
  }
}

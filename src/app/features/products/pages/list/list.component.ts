import { Component, HostListener, inject } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ProductInterface } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { InputSearchComponent } from '../../components/input-search/input-search.component';
import { Router } from '@angular/router';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    SharedModule,
    PaginationComponent,
    AvatarComponent,
    InputSearchComponent,
    DialogComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  private _productsService = inject(ProductsService);
  private _router = inject(Router);
  private _toast = inject(ToastService);

  products: ProductInterface[] = [];
  visibleProducts: ProductInterface[] = [];
  productById: ProductInterface | null = null;
  openedDropdownId: string | null = null;

  loading: boolean = true;
  showDialog: boolean = false;
  itemsPerPage: number = 5;
  searchText: string = '';

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this._productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.updateVisibleProducts();
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  deleteProduct() {
    this.loading = true;
    this._productsService.deletProduct(this.productById!.id).subscribe({
      next: () => {
        this._toast.success('Producto eliminado correctamente');
      },
      error: () => {
        this._toast.error('Ha ocurrido un problema');
        this.loading = false;
      },
      complete: () => {
        this.getProducts();
        this.loading = false;
      },
    });
  }

  updateVisibleProducts() {
    this.visibleProducts = this.products.slice(0, this.itemsPerPage);
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.updateVisibleProducts();
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.updateVisibleProducts();
  }

  openDeleteDialog(product: ProductInterface) {
    this.productById = product;
    this.showDialog = true;
  }

  confirmDelete() {
    this.deleteProduct();
    this.showDialog = false;
  }

  cancelDelete() {
    this.showDialog = false;
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    this.openedDropdownId = this.openedDropdownId === id ? null : id;
  }

  goForm(route: string, id?: string) {
    const path = id ? [route, id] : [route];
    this._router.navigate(path);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    this.openedDropdownId = null;
  }
}

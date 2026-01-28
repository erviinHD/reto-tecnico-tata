import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.PRODUCTS_ROUTES,
          ),
      },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
  },
];

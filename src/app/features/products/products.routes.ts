import { Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'new',
    component: FormComponent,
  },
  {
    path: 'edit/:id',
    component: FormComponent,
  },
];

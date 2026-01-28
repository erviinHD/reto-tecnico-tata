import { NgModule } from '@angular/core';
import { SkeletonListComponent } from './components/skeleton-list/skeleton-list.component';
import { FilterProductsPipe } from './pipes/filter-products.pipe';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';

@NgModule({
  imports: [SkeletonListComponent, FilterProductsPipe, ErrorMessagesComponent],
  exports: [SkeletonListComponent, FilterProductsPipe, ErrorMessagesComponent],
})
export class SharedModule {}

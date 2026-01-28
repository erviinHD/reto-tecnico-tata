import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 5;
  @Output() itemsPerPageChange = new EventEmitter<number>();

  onItemsPerPageChange() {
    this.itemsPerPageChange.emit(this.itemsPerPage);
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  imports: [FormsModule],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
})
export class InputSearchComponent {
  searchText: string = '';

  @Output() searchChange = new EventEmitter<string>();

  onSearch() {
    this.searchChange.emit(this.searchText.trim());
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() imgURL: string = '';
  @Input() name: string = '';

  isImageUrl = false;
  initials = '';

  ngOnChanges() {
    this.isImageUrl = this.isValidImageUrl(this.imgURL);
    this.initials = this.getInitials(this.name);
  }

  private isValidImageUrl(value: string): boolean {
    if (!value) return false;

    try {
      const url = new URL(value);
      return /\.(png|jpe?g|gif|webp|svg)$/i.test(url.pathname);
    } catch {
      return false;
    }
  }
  private getInitials(name: string): string {
    if (!name) return '';

    return name
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }
}

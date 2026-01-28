import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from './toast.service';
import { Toast } from './toast.interface';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  show = false;
  message = '';
  type: Toast['type'] = 'success';

  private timeoutId: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe((toast) => {
      this.message = toast.message;
      this.type = toast.type;
      this.show = true;

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.show = false;
      }, toast.duration || 3000);
    });
  }
}

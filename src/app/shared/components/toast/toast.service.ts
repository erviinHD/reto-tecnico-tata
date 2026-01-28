import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast, ToastType } from './toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastType = 'success', duration = 3000) {
    this.toastSubject.next({ message, type, duration });
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }
}

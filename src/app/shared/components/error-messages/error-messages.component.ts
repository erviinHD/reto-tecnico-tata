import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  imports: [CommonModule],
  templateUrl: './error-messages.component.html',
  styleUrl: './error-messages.component.css',
})
export class ErrorMessagesComponent {
  @Input() control: AbstractControl | null = null;

  get errorMessage(): string {
    if (this.control?.hasError('required')) {
      return 'Este campo es requerido!';
    } else if (this.control?.hasError('minlength')) {
      return `Debe tener al menos ${this.control.errors?.['maxlength'].requiredLength} caracteres.`;
    } else if (this.control?.hasError('maxlength')) {
      return `No puede tener más de ${this.control.errors?.['maxlength'].requiredLength} caracteres.`;
    } else if (this.control?.hasError('pattern')) {
      return 'El formato del valor es incorrecto.';
    } else if (this.control?.hasError('dateInvalid')) {
      return 'La fecha no es válida';
    } else if (this.control?.hasError('invalidId')) {
      return 'ID no válido!';
    }
    return '';
  }

  get showError(): boolean {
    return this.control?.invalid && this.control?.touched ? true : false;
  }
}

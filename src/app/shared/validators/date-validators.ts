import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function realeseDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (control.value && selectedDate <= currentDate) {
      return {
        dateInvalid: 'La fecha no es válidaLa fecha no es válida',
      };
    }
    return null;
  };
}

export function reviewDate(dateReleaseControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!dateReleaseControl?.value || !control.value) {
      return null;
    }

    const dateRelease = new Date(dateReleaseControl.value);
    const dateRevision = new Date(control.value);
    const oneYearLater = new Date(
      dateRelease.setFullYear(dateRelease.getFullYear() + 1),
    );

    if (
      dateRevision.getFullYear() !== oneYearLater.getFullYear() ||
      dateRevision.getMonth() !== oneYearLater.getMonth() ||
      dateRevision.getDate() !== oneYearLater.getDate()
    ) {
      return {
        dateInvalid: 'La fecha no es válida',
      };
    }

    return null;
  };
}

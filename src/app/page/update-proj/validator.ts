import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endDateAfterStartDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate && endDate <= startDate) {
      return { endDateBeforeStartDate: true };
    }
    return null;
  };
}

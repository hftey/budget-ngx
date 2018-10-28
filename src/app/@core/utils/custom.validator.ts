import { AbstractControl } from '@angular/forms';

export function ValidateDate(control: AbstractControl) {
    console.log('validate');

    return {validDate: true};
}
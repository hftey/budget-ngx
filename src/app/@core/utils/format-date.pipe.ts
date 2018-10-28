import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatMonthPipe'})
export class FormatMonthPipe implements PipeTransform {
    transform(value: number): string {
        var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        return monthNames[value - 1];
    }
}


@Pipe({name: 'formatDatePipe'})
export class FormatDatePipe implements PipeTransform {
    transform(value: string): string {
        return formatDate(value, "dd MMM, yyyy", 'en-US');
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'formatTypeIcon' })
export class FormatTypeIconPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer){}

    transform(type: string): SafeHtml {
        if (type == 'transferin'){
            return this.domSanitizer.bypassSecurityTrustHtml('<i class="ion-arrow-down-c"></i>');
        }else if (type == 'transferout'){
            return this.domSanitizer.bypassSecurityTrustHtml('<i class="ion-arrow-up-c"></i>');
        }else
            return '';
    }
}


@Pipe({ name: 'formatAmount' })
export class FormatAmountPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer){}
    transform(amount: number): SafeHtml{
        if (amount == 0){
            return "-";
        }
        var color = amount < 0 ? 'red' : 'blue';
        return this.domSanitizer.bypassSecurityTrustHtml('<div style="color: '+color+'">$ ' + amount.toLocaleString('en-US', {minimumFractionDigits: 2})+'</div>');
    }
}
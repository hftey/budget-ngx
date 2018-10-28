import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SharedService {
    @Output() emitBudgetLoad: EventEmitter<any> = new EventEmitter();


    private subject = new Subject<any>();
    constructor() {
    }

    setBudgetLoad() {
        this.emitBudgetLoad.emit();
    }
    getBudgetLoad() {
        return this.emitBudgetLoad;
    }

}
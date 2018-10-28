import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BudgetType } from './models/budget-type.models';

@Injectable({
    providedIn: 'root',
})
export class BudgetTypeService {

    private BudgetTypeList: Array<BudgetType> = [];

    constructor(
    ) {
        this.BudgetTypeList = [
            {id: 0,type: '', name: '-'},
            {id: 1,type: 'credit', name: 'Credit'},
            {id: 2,type: 'debit', name: 'Debit'},
            {id: 3,type: 'transferin', name: 'Transfer In'},
            {id: 4,type: 'transferout', name: 'Transfer Out'},
        ];

    }

    getTypeList (): Observable<BudgetType[]> {
        return of(this.BudgetTypeList);
    }

}
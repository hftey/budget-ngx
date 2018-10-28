import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetMonth } from './models/budget-month.models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root',
})
export class BudgetmonthService {
//  private apiUrl = 'http://192.168.0.199:8080/api/budget-month';  // URL to web api
    private apiUrl = 'http://192.168.0.199:8080/api';  // URL to web api
    constructor(
    private http: HttpClient
  ) { }

  getBudgetMonths (userid: number): Observable<BudgetMonth[]> {
      const url = `${this.apiUrl}/budget-month/${userid}`;
    return this.http.get<BudgetMonth[]>(url)
  }

    getBudgetMonthsLatest (userid: number): Observable<BudgetMonth> {
        const url = `${this.apiUrl}/budget-month-latest/${userid}`;
        return this.http.get<BudgetMonth>(url)
    }

    getBudgetMonth (budgetmonthid: number): Observable<BudgetMonth> {
        const url = `${this.apiUrl}/budget-month-detail/${budgetmonthid}`;
        return this.http.get<BudgetMonth>(url)
    }

}
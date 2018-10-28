import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './models/category.models';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
//  private apiUrl = 'http://192.168.0.199:8080/api/budget-month';  // URL to web api
    private apiUrl = 'http://192.168.0.199:8080/api';  // URL to web api
    constructor(
        private http: HttpClient
    ) { }

    getCategory (userid: number,budgetmonthid: number): Observable<Category[]> {
        const url = `${this.apiUrl}/category/${userid}/${budgetmonthid}`;
        return this.http.get<Category[]>(url)
    }


    //   getBudgetMonth(id: number): Observable<BudgetMonth> {
    //   const url = `${this.apiUrl}/${id}`;
    //   return this.http.get<BudgetMonth>(url);
    // }
    //
    // addCustomer (budgetmonth: BudgetMonth): Observable<BudgetMonth> {
    //   return this.http.post<BudgetMonth>(this.apiUrl, budgetmonth, httpOptions);
    // }

    // deleteCustomer (budgetmonth: Customer | number): Observable<Customer> {
    //   const id = typeof budgetmonth === 'number' ? budgetmonth : budgetmonth.id;
    //   const url = `${this.apiUrl}/${id}`;
    //
    //   return this.http.delete<Customer>(url, httpOptions);
    // }

    // updateCustomer (budgetmonth: Customer): Observable<any> {
    //   return this.http.put(this.apiUrl, budgetmonth, httpOptions);
    // }
}
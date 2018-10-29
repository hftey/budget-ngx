import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from './models/transaction.models';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
    providedIn: 'root',
})
export class TransactionService {
//  private apiUrl = 'http://192.168.0.199:8080/api/budget-month';  // URL to web api
    private apiUrl = 'http://budget-server.venzon-solution.com:8081/api';  // URL to web api


    constructor(
        private http: HttpClient
    ) { }

    getTransactions (userid: number,budgetmonthid: number,categoryid: number): Observable<Transaction[]> {
        const url = `${this.apiUrl}/transaction/${userid}/${budgetmonthid}/${categoryid}`;
        return this.http.get<Transaction[]>(url)
    }

    getTransaction (transactionid: number): Observable<Transaction> {
        const url = `${this.apiUrl}/transaction-detail/${transactionid}`;
        return this.http.get<Transaction>(url)
    }


    deleteTransaction (transactionid: number): Observable<any> {
        const url = `${this.apiUrl}/transaction/${transactionid}`;
        return this.http.delete(url);
    }

    addTransaction(transactionData: any): Observable<any> {
        const url = `${this.apiUrl}/transaction`;
        return this.http.post(url, transactionData, httpOptions);

    }

    saveTransaction(transactionData: any): Observable<any> {
        const url = `${this.apiUrl}/transaction`;
        return this.http.put(url, transactionData, httpOptions);

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
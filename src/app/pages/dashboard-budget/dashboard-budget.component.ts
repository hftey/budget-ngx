import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { formatNumber } from '@angular/common';


import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NbShowcaseDialogComponent } from '../../@core/utils/confirm.dialog';
import { NbDialogService  } from '@nebular/theme';

import { BudgetmonthService } from '../../@core/data/budget-month.service';
import { BudgetMonth } from '../../@core/data/models/budget-month.models';
import { CategoryService } from '../../@core/data/category.service';
import { Category } from '../../@core/data/models/category.models';
import { TransactionService } from '../../@core/data/transaction.service';
import { Transaction } from '../../@core/data/models/transaction.models';
import { BudgetTypeService } from '../../@core/data/budget-type.service';
import { BudgetType } from '../../@core/data/models/budget-type.models';
import { SharedService } from '../../@core/utils/shared.service';
import { ValidateDate } from '../../@core/utils/custom.validator';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { tap, map, flatMap, shareReplay, mergeMap } from 'rxjs/operators';
interface CategoryAmount<T> {
    [index: string]: T;
}

declare var $: any;


@Component({
  selector: 'ngx-dashboard-budget',
  templateUrl: './dashboard-budget.component.html',
  styleUrls: ['./dashboard-budget.component.scss'],
  providers: [ BudgetmonthService, CategoryService, SharedService ]
})
export class DashboardBudgetComponent implements OnInit {




  constructor(private ss: SharedService,
              private fb: FormBuilder,
              private dialogService: NbDialogService,
              private budgetMonthService: BudgetmonthService,
              private categoryService: CategoryService,
              private transactionService: TransactionService,
              private budgetTypeService: BudgetTypeService,
              private sanitizer: DomSanitizer) { }

    budgetMonthSelected: BudgetMonth;
    budgetMonthLatest: BudgetMonth;
    budgetMonthList: BudgetMonth[];
    category: Category;
    categoryList: Category[];
    budgetTypeList: BudgetType[];
    transactionList: Transaction[];

    filterBudgetType: string;
    filterBudgetMonthId: number;
    filterDesc: string;

    categoryAmountLeft: CategoryAmount<number> = {};
    categoryAmountTotal: CategoryAmount<number> = {};

    totalBalanceStart: number = 0;
    totalBalancePeriod: number = 0;
    totalBalanceEnd: number = 0;

    totalIncome: number = 0;
    totalSpending: number = 0;
    totalTransfer: number = 0;

    totalMeals: number = 0;
    totalGroceries: number = 0;
    totalGas: number = 0;
    totalToll: number = 0;

    addDate: string = '';
    addPayee: string = '';
    addDescription: string = '';
    addAmount: string = '';
    addBudgetType: string = '';
    addCategoryTransferTo: string = '';
    addCategory: string = '';



    activeTabSearch: Boolean = true;
    activeTabAdd: Boolean = false;

    loadBudgetTrack: number = 0;

    dateMin = new Date();
    dateMax = new Date();

    rows = [];
    allRows = [];

    @ViewChild('budgetTable') table: any;

    formAdd: FormGroup;
    formInitValues: any;
    saveTransaction: boolean = false;
    isEditing: boolean = false;


  ngOnInit() {

      this.budgetTypeService.getTypeList().subscribe(
          budgetTypeList => {
              this.budgetTypeList = budgetTypeList;
          }
      );

      this.budgetMonthService.getBudgetMonths(3)
          .subscribe(budgetMonthList => {
              this.budgetMonthList = budgetMonthList;
          });

      this.budgetMonthService.getBudgetMonthsLatest(3)
          .subscribe(budgetMonthLatest => {
              this.budgetMonthLatest = budgetMonthLatest;
              this.budgetMonthSelected = budgetMonthLatest;
              this.dateMin = new Date(this.budgetMonthSelected.year, this.budgetMonthSelected.month - 1, 1);
              this.dateMax = new Date(this.budgetMonthSelected.year, this.budgetMonthSelected.month, 0);

              this.filterBudgetMonthId = budgetMonthLatest.id;
              this.getBudget(this.filterBudgetMonthId);
              this.formAdd.controls['budget_month_id'].setValue(this.filterBudgetMonthId);
          });

      this.ss.getBudgetLoad().subscribe(res => {
          if (this.loadBudgetTrack === 0){
              this.filterSearch();
          }
      });



      this.formAdd = this.fb.group({
          date: ['', Validators.required],
          payee: ['', Validators.required],
          desc: [''],
          amount: ['', Validators.required],
          type: ['', Validators.required],
          addCategoryTransferTo: [''],
          category_id: ['', Validators.required],
          user_id: ['3', Validators.required],
          budget_month_id: ['', Validators.required],
          transaction_id: [''],
      });

      this.formAdd.controls['budget_month_id'].setValue(this.filterBudgetMonthId);
      this.formInitValues = this.formAdd.value;
      console.log('init form values', this.formInitValues);

   }

    clickClear(){
        this.filterDesc = '';
        this.filterBudgetType = '';
        this.filterSearch();
    }

    filterSearch(){
        let filterDesc = this.filterDesc;
        let filterBudgetType = this.filterBudgetType;
        let tempData = this.allRows;
        //let keys = Object.keys(tempData[0]);
        this.rows = tempData.filter(function(item){
            let bConditionDesc = false;
            if (item['payee'].toString().toLowerCase().indexOf(filterDesc) !== -1 || item['desc'].toString().toLowerCase().indexOf(filterDesc) !== -1 || !filterDesc){
                bConditionDesc = true;
            }

            let bConditionType = false;
            if (item['type'].toString().toLowerCase().indexOf(filterBudgetType) !== -1 || !filterBudgetType){
                bConditionType = true;
            }

            if (bConditionType && bConditionDesc){
                return true;
            }


        });

        const arrayOfKeys = Object.keys(this.categoryAmountTotal);
        arrayOfKeys.forEach(key=> {
            this.categoryAmountTotal[key] = 0;
        });
        this.totalIncome = 0;
        this.totalSpending = 0;
        this.totalTransfer = 0;

        this.rows.forEach(transaction => {
            if (transaction.type === 'debit') {
                this.categoryAmountTotal[transaction.category.name] -= transaction.amount;
                this.totalSpending -= transaction.amount;
            }

            if (transaction.type === 'credit') {
                this.categoryAmountTotal[transaction.category.name] += transaction.amount;
                this.totalIncome += transaction.amount;
            }

            if (transaction.type === 'transferin') {
                this.totalTransfer += transaction.amount;
            }

            if (transaction.type === 'transferout') {
                this.totalTransfer -= transaction.amount;
            }
        });

        this.table.offset = 0;
    }

    changeDesc(event){
        const val = event.target.value.toLowerCase();
        this.filterDesc = val;
        this.filterSearch();
    }

    changeType(budgetType){
        this.filterBudgetType = budgetType;
        this.filterSearch();
    }

    changeBudgetMonth(budgetMonthID){
        this.totalSpending = 0;
        this.totalTransfer = 0;
        this.totalIncome = 0;
        this.totalMeals = 0;
        this.totalGroceries = 0;
        this.totalGas = 0;
        this.totalToll = 0;
        this.totalBalanceStart = 0;
        this.totalBalancePeriod = 0;
        this.totalBalanceEnd = 0;
        this.filterBudgetMonthId = budgetMonthID;
        this.getBudget(budgetMonthID);
    }


    getBudget(budgetMonthID){
       this.rows = [];
       this.formAdd.controls['budget_month_id'].setValue(budgetMonthID);
       this.formInitValues.budget_month_id = budgetMonthID;
       this.budgetMonthService.getBudgetMonth(budgetMonthID)
            .subscribe(budgetMonth => {
                this.budgetMonthSelected = budgetMonth;
                console.log('selected budget month', this.budgetMonthSelected);
                this.dateMin = new Date(this.budgetMonthSelected.year, this.budgetMonthSelected.month - 1, 1);
                this.dateMax = new Date(this.budgetMonthSelected.year, this.budgetMonthSelected.month, 0);

            });

       this.categoryService.getCategory(3, budgetMonthID).subscribe(category => {
           this.categoryList = category;
           this.categoryList.forEach(category => {
               this.loadBudgetTrack++;

               this.totalBalanceEnd = this.totalBalanceStart += category.amount;
               this.categoryAmountLeft[category.name] = category.amount;
               this.categoryAmountTotal[category.name] = 0;
               this.transactionService.getTransactions(3, budgetMonthID, category.id).subscribe(transaction => {
                   this.rows = this.allRows = this.rows.concat(transaction);
                   transaction.forEach(transaction => {
                       if (transaction.type === 'debit' || transaction.type === 'transferout') {
                           this.categoryAmountLeft[category.name] -= transaction.amount;
                           this.totalBalancePeriod -= transaction.amount;
                           this.totalBalanceEnd -= transaction.amount;
                           this.categoryAmountTotal[category.name] -= transaction.type === 'debit' ? transaction.amount : 0;
                           this.totalSpending -= transaction.type === 'debit' ? transaction.amount : 0;
                           this.totalTransfer -= transaction.type === 'transferout' ? transaction.amount : 0;

                           this.totalMeals -= (transaction['payee'].toLowerCase().indexOf('meals') !== -1 || transaction['desc'].toLowerCase().indexOf('meals')) !== -1 ? transaction.amount : 0;
                           this.totalGroceries -= (transaction['payee'].toLowerCase().indexOf('groceries') !== -1 || transaction['desc'].toLowerCase().indexOf('groceries')) !== -1 ? transaction.amount : 0;
                           this.totalGas -= (transaction['payee'].toLowerCase().indexOf('gas') !== -1 || transaction['desc'].toLowerCase().indexOf('gas')) !== -1 ? transaction.amount : 0;
                           this.totalToll -= (transaction['payee'].toLowerCase().indexOf('citylink') !== -1 || transaction['desc'].toLowerCase().indexOf('citylink')) !== -1 ? transaction.amount : 0;
                       }

                       if (transaction.type === 'credit' || transaction.type === 'transferin') {
                           this.categoryAmountLeft[category.name] += transaction.amount;
                           this.totalBalancePeriod += transaction.amount;
                           this.totalBalanceEnd += transaction.amount;
                           this.categoryAmountTotal[category.name] += transaction.type == 'credit' ? transaction.amount : 0;
                           this.totalIncome += transaction.type === 'credit' ? transaction.amount : 0;
                           this.totalTransfer += transaction.type === 'transferin' ? transaction.amount : 0;
                       }

                   });

                   this.loadBudgetTrack--;
                   this.ss.setBudgetLoad();

               });

           });
       });

   }

    toggleExpandGroup(group) {
        this.table.groupHeader.toggleExpandGroup(group);
    }

    formatAmount(type): string{
      if (type === 'debit'){
          return 'red';
      }else if (type === 'credit'){
          return 'blue';
      }else if (type === 'transferin' || type === 'transferout'){
          return 'green';
      }else {
          return 'black';
      }

    }

    formatTransfer(type: string): SafeHtml{
        if (type == 'transferin'){
            return this.sanitizer.bypassSecurityTrustHtml('<ion-icon name="arrow-down"></ion-icon>');
        }else if (type == 'transferout'){
            return '<ion-icon name="arrow-up"></ion-icon>';
        }else
            return '';

    }

    formatTotalToll(): number{
        return this.totalToll;
    }

    formatTotalGas(): number{
        return this.totalGas;
    }

    formatTotalGroceries(): number{
        return this.totalGroceries;
    }

    formatTotalMeals(): number{
        return this.totalMeals;
    }

    formatBalanceEnd(): number{
        return this.totalBalanceEnd;
    }

    formatBalancePeriod(): number{
        return this.totalBalancePeriod;
    }

    formatBalanceStart(): number{
        return this.totalBalanceStart;
    }

    formatTotalBalance(): number{
        return this.totalIncome + this.totalSpending + this.totalTransfer;
    }

    formatTotalIncome(): number{
        return this.totalIncome;
    }

    formatTotalSpending(): number{
        return this.totalSpending;
    }

    formatTotalTransfer(): number{
        return this.totalTransfer;
    }

    formatAmountLeft(categoryName: string): number{
      return this.categoryAmountLeft[categoryName];
    }

    formatAmountTotal(categoryName: string): number{
        return this.categoryAmountTotal[categoryName];
    }

    formatOptionDefault(optionName: string, optionDefaultName: string): string{
        return optionName == '-' ? optionDefaultName : optionName;
    }

    clickEdit(transactionId){
        this.activeTabSearch = false;
        this.activeTabAdd = true;
        this.isEditing = true;
        this.transactionService.getTransaction(transactionId)
            .subscribe(transaction => {
                console.log('edit transaction', transaction);
                this.formAdd.controls['budget_month_id'].setValue(this.filterBudgetMonthId);
                this.formAdd.controls['transaction_id'].setValue(transactionId);
                this.formAdd.controls['date'].setValue(new Date(transaction.date));
                this.formAdd.controls['payee'].setValue(transaction.payee);
                this.formAdd.controls['desc'].setValue(transaction.desc);
                this.formAdd.controls['amount'].setValue(formatNumber(transaction.amount, 'en-US', '0.2-2'));
                this.formAdd.controls['type'].setValue(transaction.type);
                this.formAdd.controls['category_id'].setValue(transaction.category_id);

                $('.scrollable-container').scrollTop(0);

            });

    }

    clickCancel(){
        this.activeTabSearch = true;
        this.activeTabAdd = false;
        this.isEditing = false;
        this.formAdd.reset(this.formInitValues);


    }

    clickDelete(transactionId){
      this.dialogService.open(NbShowcaseDialogComponent, {
          closeOnBackdropClick: false,
          context: {
              title: 'Delete Transaction',
              message: 'Confirm delete this transaction?',
          }
      }).onClose.subscribe(
          result => {
              if (result){
                  this.transactionService.deleteTransaction(transactionId).subscribe(result => {
                      if (result.result){
                          this.getBudget(this.filterBudgetMonthId);
                      }
                  });
              }
          }
      );

    }

    open(dialog: TemplateRef<any>) {
        this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }



    get f() { return this.formAdd.controls; }

    clickSaveTransaction(){
      this.saveTransaction = true;
        const formValues = this.formAdd.value;
        console.log('saveing form value', formValues);

        if (!this.formAdd.valid) {
            return;
        }

        if (formValues.transaction_id != ''){
            this.transactionService.saveTransaction(this.formAdd.value).subscribe(result => {
                this.getBudget(this.filterBudgetMonthId);
                this.formAdd.reset(this.formInitValues);
                this.saveTransaction = false;
                this.isEditing = false;

            });

        }else{
            this.transactionService.addTransaction(this.formAdd.value).subscribe(result => {
                this.getBudget(this.filterBudgetMonthId);
                this.formAdd.reset(this.formInitValues);
                this.saveTransaction = false;
            });

        }



    }

}

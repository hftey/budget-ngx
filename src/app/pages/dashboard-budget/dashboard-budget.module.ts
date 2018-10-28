import {Component, Input, NgModule} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import { NbDatepickerModule, NbDialogRef } from '@nebular/theme';
import { DashboardBudgetComponent } from './dashboard-budget.component';
import { FormatMonthPipe, FormatDatePipe } from '../../@core/utils/format-date.pipe'

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormatTypeIconPipe, FormatAmountPipe } from "../../@core/utils/format-string.pipe";


@NgModule({
    imports: [
        ThemeModule,
        NgxDatatableModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NbDatepickerModule,
    ],
    declarations: [
        DashboardBudgetComponent,
        FormatMonthPipe,
        FormatDatePipe,
        FormatTypeIconPipe,
        FormatAmountPipe,
    ],
    providers: [
        FormatMonthPipe,
        FormatDatePipe,
        FormatTypeIconPipe,
        FormatAmountPipe,
    ]
})
export class DashboardBudgetModule { }

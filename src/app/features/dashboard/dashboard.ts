import { Component } from '@angular/core';
import { TransactionList } from '../transaction-list/transaction-list';
import { Summary } from '../summary/summary';
import { MonthChart } from "../month-chart/month-chart";
import { DoughnutChart } from "../doughnut-chart/doughnut-chart";

@Component({
  selector: 'app-dashboard',
  imports: [TransactionList, Summary, MonthChart, DoughnutChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

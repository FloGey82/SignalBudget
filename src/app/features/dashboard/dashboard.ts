import { Component } from '@angular/core';
import { TransactionList } from '../transaction-list/transaction-list';

@Component({
  selector: 'app-dashboard',
  imports: [TransactionList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

import { Component, inject } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';

@Component({
  selector: 'app-month-selector',
  imports: [],
  templateUrl: './month-selector.html',
  styleUrl: './month-selector.scss',
  standalone: true,
})
export class MonthSelector {
selectedMonth() {
}
  transactionStore = inject(TransactionStore);
}

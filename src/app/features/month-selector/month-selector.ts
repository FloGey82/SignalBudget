import { Component, inject } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';
import { MonthFormat } from "../../pipes/format-month.pipe";

@Component({
  selector: 'app-month-selector',
  imports: [MonthFormat],
  templateUrl: './month-selector.html',
  styleUrl: './month-selector.scss',
  standalone: true,
})
export class MonthSelector {
  transactionStore = inject(TransactionStore);
}

import { Component, inject } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  imports: [CurrencyPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  transactionStore = inject(TransactionStore);
  summary = this.transactionStore.summary;
}

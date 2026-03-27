import { Component, inject } from '@angular/core';
import { sortableTransactionKeys, TransactionStore } from '../../stores/transaction.store';

const SORT_OPTIONS: { key: sortableTransactionKeys; label: string }[] = [
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
];

@Component({
  selector: 'app-sort-buttons',
  imports: [],
  templateUrl: './sort-buttons.html',
  styleUrl: './sort-buttons.scss',
})
export class SortButtons {
  store = inject(TransactionStore);
  sortOptions = SORT_OPTIONS;
}

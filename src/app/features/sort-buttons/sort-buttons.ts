import { Component, inject } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';

@Component({
  selector: 'app-sort-buttons',
  imports: [],
  templateUrl: './sort-buttons.html',
  styleUrl: './sort-buttons.scss',
})
export class SortButtons {
  store = inject(TransactionStore);

}

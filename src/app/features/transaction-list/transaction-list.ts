import { Component, inject } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-transaction-list',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  transactionStore = inject(TransactionStore);
  summary = this.transactionStore.summary;
  transactions = this.transactionStore.transactions;

  deleteTransaction(id: string) {
    if (id) {
      this.transactionStore.deleteTransaction(id);
    }
  }
}

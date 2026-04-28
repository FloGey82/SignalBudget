import { Component, inject, signal } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Drawer } from '../../shared/drawer/drawer';
import { TransactionForm } from '../transaction-form/transaction-form';
import { ToastService } from '../../shared/toast/toast.service';
import { SortButtons } from '../sort-buttons/sort-buttons';
import { MonthSelector } from "../month-selector/month-selector";

@Component({
  selector: 'app-transaction-list',
  imports: [CurrencyPipe, DatePipe, Drawer, TransactionForm, SortButtons, MonthSelector],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  transactionStore = inject(TransactionStore);
  private readonly _toast = inject(ToastService);

  summary = this.transactionStore.summary;
  transactions = this.transactionStore.getFilteredTransactions;
  showPanel = signal<boolean>(false);
  editingTransactionId = signal<string | null>(null);

  deleteTransaction(id: string) {
    if (id) {
      this.transactionStore.deleteTransaction(id);
      this._toast.show('Transaction deleted 🗑️', 'info');
    }
  }
}

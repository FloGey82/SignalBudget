import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Transaction } from '../models/transaction.model';
import { computed } from '@angular/core';

type transactionState = {
  transactions: Transaction[];
};

const initialTransactionState: transactionState = { transactions: [] };

export const transationStore = signalStore(
  withState(initialTransactionState),

  withComputed((store) => ({
    total: computed(() => store.transactions().reduce((sum, t) => sum + t.amount, 0)),
  })),

  withMethods((store) => ({
    //create
    addExpense(transaction: Transaction) {
      patchState(store, (state) => ({
        transactions: { ...state.transactions, transaction },
      }));
    },
    //update
    updateExpense(transaction: Transaction) {
      patchState(store, (state) => ({
        transactions: [...state.transactions.filter((t) => t.id !== transaction.id), transaction],
      }));
    },
    //deletegit commit --amend --reset-author
    deleteExpense(id: string) {
      patchState(store, (state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    },
  })),
);

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Transaction } from '../models/transaction.model';
import { computed, effect } from '@angular/core';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { CategoryType } from '../models/category.model';

type TransactionState = {
  transactions: Transaction[];
  filter: { query: CategoryType | 'all'; order: 'asc' | 'desc' };
};

const LOCAL_STORAGE_KEY = 'transactions';

const initialTransactionState: TransactionState = (() => {
  const state = loadFromLocalStorage<TransactionState>(LOCAL_STORAGE_KEY, {
    transactions: [],
    filter: {
      query: 'all',
      order: 'asc',
    },
  });

  return {
    ...state,
    transactions: state.transactions.map((t) => ({
      ...t,
      date: new Date(t.date), // 🔥 wichtig
    })),
  };
})();

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialTransactionState),

  withComputed((store) => ({
    getFilteredTransactions: computed(() => {
      const { query, order } = store.filter();
      const direction = order === 'asc' ? 1 : -1;

      return store
        .transactions()
        .filter((t) => query === 'all' || t.category === query)
        .sort((a, b) => direction * a.amount - direction * b.amount);
    }),
    summary: computed(() => {
      const transactions = store.transactions();

      let income = 0;
      let expense = 0;

      for (const t of transactions) {
        if (t.category === 'income') {
          income += t.amount;
        } else {
          expense += t.amount;
        }
      }

      return {
        income,
        expense,
        balance: income - expense,
      };
    }),
  })),

  withMethods((store) => ({
    //create
    addTransaction(transaction: Transaction) {
      patchState(store, (state) => ({
        transactions: [...state.transactions, transaction],
      }));
    },
    //update
    updateTransaction(updated: Transaction) {
      patchState(store, (state) => ({
        transactions: state.transactions.map((t) => (t.id === updated.id ? updated : t)),
      }));
    },
    //delete
    deleteTransaction(id: string) {
      patchState(store, (state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    },

    getTransactionById(id: string | null | undefined): Transaction | undefined {
      if (!id) return undefined;
      console.log(store.transactions());
      return store.transactions().find((t) => t.id === id) ?? undefined;
    },
  })),
  withHooks((store) => ({
    onInit() {
      effect(() => {
        const state = store.transactions();

        saveToLocalStorage(LOCAL_STORAGE_KEY, {
          transactions: state,
        });
      });
    },
  })),
);

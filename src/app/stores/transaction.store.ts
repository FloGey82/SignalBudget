import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CategoryType, Transaction } from '../models/transaction.model';
import { computed, effect } from '@angular/core';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

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

  const transactions = (state.transactions ?? []).map((t) => ({
    ...t,
    date: new Date(t.date),
  }));

  return {
    transactions,
    filter: state.filter ?? {
      query: 'all',
      order: 'asc',
    },
  };
})();

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialTransactionState),

  withComputed((store) => ({
    getFilteredTransactions: computed(() => {
      const query = store.filter.query();
      const order = store.filter.order();

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
    addTransaction(transaction: Transaction) {
      patchState(store, (state) => ({
        transactions: [...state.transactions, transaction],
      }));
    },

    updateTransaction(updated: Transaction) {
      patchState(store, (state) => ({
        transactions: state.transactions.map((t) => (t.id === updated.id ? updated : t)),
      }));
    },

    deleteTransaction(id: string) {
      patchState(store, (state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    },

    setFilterQuery(query: CategoryType | 'all') {
      patchState(store, (state) => ({
        filter: {
          ...state.filter,
          query,
        },
      }));
    },

    setSortOrder(order: 'asc' | 'desc') {
      patchState(store, (state) => ({
        filter: {
          ...state.filter,
          order,
        },
      }));
    },

    getTransactionById(id: string | null | undefined): Transaction | undefined {
      if (!id) return undefined;
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

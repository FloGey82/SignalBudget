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
  filter: { query: CategoryType | 'all'; order: 'asc' | 'desc'; month: null | string };
};

const LOCAL_STORAGE_KEY = 'transactions';

const initialTransactionState: TransactionState = (() => {
  const state = loadFromLocalStorage<TransactionState>(LOCAL_STORAGE_KEY, {
    transactions: [],
    filter: {
      query: 'all',
      order: 'asc',
      month: null,
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
      month: null,
    },
  };
})();

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialTransactionState),

  withComputed((store) => ({
    availableMonths: computed(() => {
      const transaction = store.transactions();
      const months = new Set<string>();

      for (const t of transaction) {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        months.add(key);
      }

      return Array.from(months).sort().reverse();
    }),

    getFilteredTransactions: computed(() => {
      const { query, order, month } = store.filter;
      const direction = order() === 'asc' ? 1 : -1;

      return store
        .transactions()
        .filter((t) => {
          const matchcategory = query() === 'all' || t.category === query();
          if (!month()) return matchcategory;

          const date = new Date(t.date);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          return matchcategory && key === month();
        })
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

    setMonth(month: string | null) {
      patchState(store, (state) => ({
        filter: {
          ...state.filter,
          month,
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
        const transactions = store.transactions();
        const filter = store.filter();

        saveToLocalStorage(LOCAL_STORAGE_KEY, {
          transactions: transactions,
          filter: filter,
        });
      });
    },
  })),
);

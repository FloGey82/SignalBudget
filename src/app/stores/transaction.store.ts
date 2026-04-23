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
import { formatMonth } from '../utils/formatMonth';

type TransactionState = {
  transactions: Transaction[];
  filter: {
    query: CategoryType | 'all';
    order: 'asc' | 'desc';
    sortBy: sortableTransactionKeys;
    month: null | string;
  };
};

const LOCAL_STORAGE_KEY = 'transactions';
export type sortableTransactionKeys = keyof Pick<Transaction, 'amount' | 'date' | 'category'>;

const initialTransactionState: TransactionState = (() => {
  const state = loadFromLocalStorage<TransactionState>(LOCAL_STORAGE_KEY, {
    transactions: [],
    filter: {
      query: 'all',
      order: 'asc',
      sortBy: 'date',
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
      sortBy: 'date',
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

    monthlyChartData: computed(() => {
      const transactions = store.transactions();

      const map = new Map<string, { income: number; expense: number }>();

      for (const t of transactions) {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;

        if (!map.has(key)) {
          map.set(key, { income: 0, expense: 0 });
        }

        const entry = map.get(key)!;

        if (t.category === 'income') {
          entry.income += t.amount;
        } else {
          entry.expense += t.amount;
        }
      }

      return Array.from(map.entries())
        .sort()
        .map(([key, value]) => {
          const [year, month] = key.split('-').map(Number);

          return {
            label: formatMonth(new Date(year, month)),
            ...value,
          };
        });
    }),

    categoryChartData: computed(() => {
      const map = new Map<string, number>();

      for (const t of store.transactions()) {
        if (t.category !== 'expense') continue;

        const key = t.description || 'other';

        map.set(key, (map.get(key) ?? 0) + t.amount);
      }

      return Array.from(map.entries()).map(([label, value]) => ({
        label,
        value,
      }));
    }),

    getFilteredTransactions: computed(() => {
      const { query, order, month, sortBy } = store.filter();
      const direction = order === 'asc' ? 1 : -1;

      return store
        .transactions()
        .filter((t) => {
          const matchcategory = query === 'all' || t.category === query;
          if (!month) return matchcategory;

          const date = new Date(t.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          return matchcategory && monthKey === month;
        })
        .sort((a, b) => {
          const aValue = a[sortBy];
          const bValue = b[sortBy];

          if (aValue instanceof Date && bValue instanceof Date) {
            return direction * (aValue.getTime() - bValue.getTime());
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction * aValue.localeCompare(bValue);
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction * (aValue - bValue);
          }

          return 0;
        });
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

    setSortBy(key: sortableTransactionKeys) {
      patchState(store, (state) => ({
        filter: {
          ...state.filter,
          sortBy: key,
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

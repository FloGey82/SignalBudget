export interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
  description: string;
  date: Date;
}

export type CategoryType = 'income' | 'expense';

import { Category } from './category.model';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: Date;
}

import {CategoryType } from './category.model';

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
  description: string;
  date: Date;
}

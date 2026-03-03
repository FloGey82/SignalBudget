import { v4 as uuidv4 } from 'uuid';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

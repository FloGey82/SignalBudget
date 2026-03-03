import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { TransactionForm } from './features/transaction-form/transaction-form';
import { TransactionList } from './features/transaction-list/transaction-list';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'add', component: TransactionForm },
  { path: 'history', component: TransactionList },
  { path: '**', component: Dashboard },
];

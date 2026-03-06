import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { TransactionForm } from './features/transaction-form/transaction-form';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'add', component: TransactionForm },
  { path: 'edit/:id', component: TransactionForm },
  { path: '**', component: Dashboard },
];

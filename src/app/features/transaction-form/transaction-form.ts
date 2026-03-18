import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionStore } from '../../stores/transaction.store';
import { v4 as uuidv4 } from 'uuid';
import { ToastService } from '../../shared/toast/toast.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {
  transactionForm: FormGroup;
  transactionId = input<string | null>(null);

  private readonly _transactionStore = inject(TransactionStore);
  private readonly _toast = inject(ToastService);

  cancel = output<void>();
  save = output<void>();

  constructor(private _fb: FormBuilder) {
    this.transactionForm = this._fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      category: [null, Validators.required],
      date: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
    });

    effect(() => {
      const transaction = this._transactionStore.getTransactionById(this.transactionId());
      if (transaction) {
        this.transactionForm.patchValue({
          ...transaction,
          date: transaction.date.toISOString().split('T')[0],
        });
      }
    });
  }

  submit() {
    const value = this.transactionForm.value;

    const transaction = {
      id: this.transactionId() ?? uuidv4(),
      amount: value.amount,
      description: value.description,
      category: value.category,
      date: new Date(value.date),
    };

    if (this.transactionId()) {
      this._transactionStore.updateTransaction(transaction);
      this._toast.show('Transaction added 💸', 'success');
    } else {
      this._transactionStore.addTransaction(transaction);
      this._toast.show('Transaction updated 💸', 'success');
    }

    this.transactionForm.reset({ amount: 0, type: 'expense', category: null });
    this.save.emit();
  }

  cancelEmit() {
    this.transactionForm.reset({ amount: 0, type: 'expense', category: null });
    this.cancel.emit();
  }
}

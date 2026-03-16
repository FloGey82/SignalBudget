import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionStore } from '../../stores/transaction.store';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {
  transactionForm: FormGroup;
  transactionId = input<string | null>(null);

  categories: Category[] = [
    { id: 'food', name: 'Essen', type: 'expense' },
    { id: 'salary', name: 'Gehalt', type: 'income' },
  ];

  private readonly _transactionStore = inject(TransactionStore);

  cancel = output<void>();
  save = output<void>();

  constructor(private _fb: FormBuilder) {
    this.transactionForm = this._fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      category: [null, Validators.required],
      date:[null, Validators.required]
    });

    effect(() => {
      const transaction = this._transactionStore.getTransactionById(this.transactionId());
      if (transaction) {
        this.transactionForm.patchValue(transaction);
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
      date: new Date(),
    };

    if (this.transactionId()) {
      this._transactionStore.updateTransaction(transaction);
    } else {
      this._transactionStore.addTransaction(transaction);
    }

    this.transactionForm.reset({ amount: 0, type: 'expense', category: null });
    this.save.emit();
  }
  
  cancelEmit() {
    this.transactionForm.reset({ amount: 0, type: 'expense', category: null });
    this.cancel.emit();
  }
}

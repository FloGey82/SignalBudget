import { Component, computed, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionStore } from '../../stores/transaction.store';

@Component({
  selector: 'app-month-chart',
  imports: [BaseChartDirective],
  templateUrl: './month-chart.html',
  styleUrl: './month-chart.scss',
})
export class MonthChart {
  store = inject(TransactionStore);

  data = computed(() => {
    const months = this.store.monthlyChartData();

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: 'Income',
          data: months.map((m) => m.income),
        },
        {
          label: 'Expense',
          data: months.map((m) => m.expense),
        },
        {
          type: 'line' as const,
          label: 'Balance',
          data: months.map((m) => m.income - m.expense),
          tension: 0.3,
        },
      ],
    };
  });

  options = {
    responsive: true,
  };
}

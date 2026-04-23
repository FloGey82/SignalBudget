import { Component, computed, inject } from '@angular/core';
import { TransactionStore } from '../../stores/transaction.store';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  imports: [BaseChartDirective],
  standalone: true,
  templateUrl: './doughnut-chart.html',
  styleUrl: './doughnut-chart.scss',
})
export class DoughnutChart {
  private _store = inject(TransactionStore);

  data = computed<ChartData<'doughnut', number[], string>>(() => {
    const items = this._store.categoryChartData();

    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0'],
        },
      ],
    };
  });

  options = {
    responsive: true,
    cutout: '70%',
  };
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthFormat',
  standalone: true,
})
export class MonthFormat implements PipeTransform {
  private formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
  });

  transform(value: string): string {
    const [year, month] = value.split('-').map(Number);
    return this.formatter.format(new Date(year, month));
  }
}

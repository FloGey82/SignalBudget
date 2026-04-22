import { Pipe, PipeTransform } from '@angular/core';
import { formatMonth } from '../utils/formatMonth';

@Pipe({
  name: 'monthFormat',
  standalone: true,
})
export class MonthFormat implements PipeTransform {
  transform(value: string): string {
    const [year, month] = value.split('-').map(Number);
    return formatMonth(new Date(year, month));
  }
}

import { Injectable, signal } from '@angular/core';

type Toast = {
  message: string;
  type: 'success' | 'error' | 'info';
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<Toast | null>(null);

  show(message: string, type: Toast['type'] = 'info') {
    this.toast.set({ message, type });

    setTimeout(() => {
      this.toast.set(null);
    }, 2500);
  }
  clear() {
    this.toast.set(null);
  }
}

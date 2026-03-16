import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.html',
  styleUrls: ['./drawer.scss'],
  standalone: true,
})
export class Drawer {
  open = input(false);
  openChange = output<boolean>();
  isVisible = signal(false);
  slideIn = signal(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.isVisible.set(true);
        setTimeout(() => this.slideIn.set(true), 0);
      } else {
        this.slideIn.set(false);
        setTimeout(() => this.isVisible.set(false), 250);
      }
    });
  }

  close() {
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open()) this.close();
  }
}

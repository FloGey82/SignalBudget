import { Component, HostListener, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-drawer',
  imports: [],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss',
  standalone: true,
})
export class Drawer {
  open = input(false);
  openChangeEmit = output<boolean>();
  private _isOpen = signal(false);

  close() {
    this._isOpen.set(false);
    this.openChangeEmit.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this._isOpen()) {
      this.close();
    }
  }
}

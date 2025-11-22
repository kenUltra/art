import { Component, input } from '@angular/core';

@Component({
  selector: 'load-art',
  imports: [],
  templateUrl: 'load.component.html',
  styleUrl: 'load.component.css',
})
export class LoadComponent {
  loadCls = input<string>('');
  loadText = input<string>('Loading...');

  constructor() {}
  cls(): Array<string> {
    return ['wrapper-tls', this.loadCls()];
  }
}

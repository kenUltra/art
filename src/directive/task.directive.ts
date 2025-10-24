import { Directive, effect, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[task-directive]',
  standalone: true,
})
export class TaskDirective {
  timerRef = input.required<number>();
  parentLightSelector = input.required<HTMLElement>();

  private render2 = inject(Renderer2);

  loops: any;

  constructor() {
    effect(() => {
      this.showLight();
    });
  }
  private showLight(): void {
    if (this.timerRef() == 0) {
      const all: HTMLCollection = this.parentLightSelector().children;
      this.render2.setStyle(all.item(0), 'opacity', '1');
      this.render2.setStyle(all.item(1), 'opacity', '1');
      this.render2.setStyle(all.item(2), 'opacity', '1');
      this.render2.setStyle(all.item(3), 'opacity', '1');

      this.render2.setStyle(all.item(0), 'left', '100%');
      this.render2.setStyle(all.item(0), 'transition-delay', '.1s');

      this.render2.setStyle(all.item(1), 'top', '100%');
      this.render2.setStyle(all.item(1), 'transition-delay', '.6s');

      this.render2.setStyle(all.item(2), 'right', '100%');
      this.render2.setStyle(all.item(2), 'transition-delay', '1.1s');

      this.render2.setStyle(all.item(3), 'bottom', '100%');
      this.render2.setStyle(all.item(3), 'transition-delay', '1.8s');
    }
  }
}

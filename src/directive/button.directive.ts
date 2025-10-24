import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[buttonEffect]',
  standalone: true,
})
export class ButtomDirective {
  queryPath = input.required<string>();
  pathPage = input<string>('');

  private hostRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(
    ElementRef<ElementRef>
  );
  private render: Renderer2 = inject<Renderer2>(Renderer2);

  constructor(private router: Router) {}
  @HostListener('click', ['$event']) effectBtn(clickEvent: MouseEvent) {
    const XAxes: number = clickEvent.clientX - this.hostRef.nativeElement.offsetLeft;
    const YAxes: number = clickEvent.clientY - this.hostRef.nativeElement.offsetTop;

    const refbtn = this.hostRef.nativeElement.querySelector<HTMLElement>(`.${this.queryPath()}`);

    this.render.setStyle(refbtn, 'top', YAxes + 'px');
    this.render.setStyle(refbtn, 'left', XAxes + 'px');

    refbtn == null
      ? null
      : refbtn.animate(
          {
            width: ['0%', '50%', '150%'],
            height: ['50%', '50%', '150%'],
            opacity: ['.1', '.5', '.12'],
            easing: ['ease-in'],
          },
          950
        );
    this.pathPage() == '' ? null : this.router.navigate([this.pathPage()], { replaceUrl: true });
  }
}

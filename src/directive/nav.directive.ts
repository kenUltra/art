import {
  AfterContentInit,
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
  selector: '[nav-link-tracker]',
  standalone: true,
})
export class NavDirective implements OnInit, AfterContentInit {
  linkSelector = input.required<string>();
  capsuleSelector = input.required<string>();

  private router: Router = inject(Router);
  private elementRef: ElementRef = inject(ElementRef);
  private renderUI: Renderer2 = inject(Renderer2);
  private slierRef: HTMLElement | null = null;

  readonly hideOnPath = signal<string>('/');
  constructor() {
    afterNextRender(() => {
      this.router.events.subscribe((value: Event) => {
        if (!this.slierRef) {
          this.slierRef = this.elementRef.nativeElement.querySelector(this.capsuleSelector());
        }
        this.updateSliderPosition();
      });
    });
  }
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {});
  }
  ngAfterContentInit(): void {}

  private updateSliderPosition(): void {
    const activeLink: HTMLElement = this.elementRef.nativeElement.querySelector(
      `${this.linkSelector()}.focus-page`
    );
    const mediaQuery = window.matchMedia('(max-width: 505px)');

    const currentUrl: string = this.router.url;
    const hideSlider: string = this.hideOnPath();

    if (this.slierRef && activeLink && currentUrl !== hideSlider) {
      const { offsetLeft, offsetWidth } = activeLink;
      if (!mediaQuery.matches) {
        this.renderUI.setStyle(this.slierRef, 'transform', `translate(${offsetLeft}px, -50%`);
        this.renderUI.setStyle(this.slierRef, 'width', `${offsetWidth}px`);
        this.renderUI.setStyle(this.slierRef, 'opacity', '1');
      }
      return;
    }
    if (this.slierRef) {
      this.renderUI.setStyle(this.slierRef, 'opacity', '0');
    }
  }
}

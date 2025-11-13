import { Component, inject, input } from '@angular/core';
import { ThemeServices } from '../../../services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'plus-icon',
  imports: [],
  template: ` <style lang="css">
      .plus-icon {
        margin-inline-end: 14px;
      }
      .light-mode circle {
        stroke: var(--color-light);
      }
      .dark-mode circle {
        stroke: var(--color-dark);
      }
      .light-mode g {
        fill: var(--color-light);
      }
      .dark-mode g {
        fill: var(--color-dark);
      }
      .icon-bs-app{
        transform: translate(0px, 3px);
      }
    </style>
    <svg
      [class]="plusClass()"
      version="1.1"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="11.3" style="fill: none;"></circle>
      <g transform="translate(7 7)" style="stroke: none;">
        <path
          d="m9 4h-3v-3c0-0.553-0.447-1-1-1s-1 0.447-1 1v3h-3c-0.553 0-1 0.447-1 1s0.447 1 1 1h3v3c0 0.553 0.447 1 1 1s1-0.447 1-1v-3h3c0.553 0 1-0.447 1-1s-0.447-1-1-1"
        ></path>
      </g>
    </svg>`,
})
export class PlusComponent {
  inputCls = input<string>('');
  themeSignal = inject<ThemeServices>(ThemeServices);
  currentTheme = toSignal(this.themeSignal.themeResolver.asObservable());

  constructor() {}
  plusClass(): Array<string> {
    return ['plus-icon', this.inputCls(), this.currentTheme() ?? ''];
  }
}

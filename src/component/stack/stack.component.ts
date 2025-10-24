import { afterNextRender, Component, inject, input, signal } from '@angular/core';

import { iStack } from '../../utils/stack';
import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';

@Component({
  selector: 'stack-app',
  imports: [],
  templateUrl: 'stack.component.html',
})
export class StackComponent {
  themeSevices = inject<ThemeServices>(ThemeServices);

  stackValue = input.required<iStack>();

  currentTheme = signal<string>('');
  isModalOpen = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.themeSevices.themeResolver.subscribe((value: eTheme) => {
        this.currentTheme.set(value);
      });
    });
  }
  modalClass(baseClass: string): Array<string> {
    const mdl: string = this.isModalOpen() ? '' : '';
    return [baseClass];
  }
  mainTheme(): Array<string> {
    return ['stack-bx', this.currentTheme()];
  }
}

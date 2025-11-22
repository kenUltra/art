import { afterNextRender, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { iStack } from '../../utils/stack';
import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';

export interface serverStatus {
  message: string;
  isCorrect: boolean;
}

@Component({
  selector: 'stack-app',
  imports: [FormsModule],
  templateUrl: 'stack.component.html',
  styleUrl: 'stack.component.css',
})
export class StackComponent {
  themeSevices = inject<ThemeServices>(ThemeServices);

  stackValue = input.required<iStack>();
  oldValue = input<string>();
  userChangeName = input<serverStatus | null>();
  boxHasValue = signal<boolean | null>(null);

  newValue = signal<string>('');
  currentTheme = signal<string>('');
  openStack = output<iStack | null>();
  changeValue = output<string>();
  backToSetting = output<boolean>();

  healine = computed(() => {
    const change: string = 'Change ';
    if (this.stackValue().valueToChange == 'userName') {
      return change + 'user name';
    }
    return change + 'password';
  });

  constructor() {
    afterNextRender(() => {
      this.themeSevices.themeResolver.subscribe((value: eTheme) => {
        this.currentTheme.set(value);
      });
    });
  }

  mainTheme(): Array<string> {
    return ['stack-bx', this.currentTheme()];
  }
  stackCLicked(): void {
    this.openStack.emit(this.stackValue());
  }
  backHome(): void {
    this.backToSetting.emit(this.stackValue().isStackOpen);
  }
  changeOldValue(): void {
    if (this.newValue().length == 0 || this.newValue().length < 3) {
      this.boxHasValue.set(false);
      return;
    }
    this.changeValue.emit(this.newValue());
    this.boxHasValue.set(true);
    this.newValue.set('');
  }
  boxVal(): Array<string> {
    const boxRes: string =
      this.boxHasValue() == null ? '' : this.boxHasValue() ? 'rg-vl-bx' : 'wg-vl-bx';
    return ['wp-bx-ln', boxRes];
  }
  serverStyle(): Array<string> {
    const cls: string = this.userChangeName()?.isCorrect ? 'sc-st' : 'er-st';
    return ['resp-tp', cls];
  }

  modalClass(baseClass: string): Array<string> {
    const mdl: string = this.stackValue().isStackOpen ? 'mdl-on' : 'nt-ml';
    return [baseClass, mdl];
  }
}

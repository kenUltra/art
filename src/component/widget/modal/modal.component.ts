import { afterNextRender, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ThemeServices } from '../../../services/theme.service';
import { eTheme } from '../../../utils/listEmun';
import { iModal, iModalInput } from '../../../utils/modal';

@Component({
  selector: 'modal-app',
  imports: [FormsModule],
  templateUrl: 'modal.component.html',
})
export class ModalComponent implements OnInit {
  themeService = inject<ThemeServices>(ThemeServices);

  modalData = input.required<iModal>();
  modalControl = input<iModalInput>();
  customClass = input<string>('');

  textTyped = output<string>();

  themeSignal = signal<string>('');
  inputValue = signal<string>('');

  constructor(private title: Title) {
    afterNextRender({
      write: () => {
        this.themeService.themeResolver.subscribe((value: eTheme) => {
          this.themeSignal.set(value);
        });
      },
    });
  }
  ngOnInit(): void {
    this.title.setTitle(this.modalData().headTitle + ' | Art inc');
  }
  getInputValue(): void {
    this.textTyped.emit(this.inputValue());
  }
}

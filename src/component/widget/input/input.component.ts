import { Component, input, InputSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inputWork } from '../../../utils/employee';

@Component({
  selector: 'input-ui',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: 'input.component.html',
  styleUrl: 'input.component.css',
})
export class Inputcomponent {
  detailInput: InputSignal<inputWork> = input.required<inputWork>();
  themeValue: InputSignal<string> = input.required<string>();
  inputClass: InputSignal<string> = input<string>('');

  constructor() {}
  windowTheme(): Array<string> {
    return ['input-wap', this.themeValue()];
  }
}

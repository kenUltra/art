import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeServices } from '../../services/theme.service';
import { iuserProfile } from '../../utils/user';

@Component({
  selector: 'card-user',
  imports: [RouterLink],
  templateUrl: 'card.component.html',
  styleUrl: 'card.component.css',
})
export class CardUserCompnents {
  themeService = inject<ThemeServices>(ThemeServices);
  userCard = input.required<iuserProfile>();
  themeSignal = signal<string>('');
  constructor() {
    this.themeService.themeResolver.subscribe((value) => {
      this.themeSignal.set(value);
    });
    afterNextRender(() => {
      this.themeService.getTheme();
    });
  }
}

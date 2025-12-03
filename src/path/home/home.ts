import { afterNextRender, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, UpperCasePipe } from '@angular/common';

import { ThemeServices } from '../../services/theme.service';
import { ButtomDirective } from '../../directive/button.directive';

@Component({
  selector: 'home-page',
  imports: [UpperCasePipe, ButtomDirective],
  templateUrl: 'home.html',
  styleUrl: 'home.css',
})
export class HomePage {
  private platform = inject(PLATFORM_ID);
  themeServices: ThemeServices = inject<ThemeServices>(ThemeServices);
  themSignal = signal<string>('');

  mainMessage = signal<string>('');

  constructor(private router: Router) {
    this.timeofDay();
    afterNextRender(() => {
      this.themeServices.themeResolver.subscribe((value) => {
        this.themSignal.set(value);
      });
    });
    if (isPlatformBrowser(this.platform)) {
      this.themeServices.getTheme();
    }
  }

  clickTaskUI(): void {
    this.router.navigate(['task']);
  }
  addTaskPage(): void {
    this.router.navigate([]);
  }

  private timeofDay(): string {
    const date: number = new Date().getHours();
    if (date >= 5 && date < 12) {
      this.mainMessage.set('Ready to organize your day?');
    } else if (date >= 12 || date < 18) {
      this.mainMessage.set("Let's tackle your tasks together");
    } else {
      this.mainMessage.set('Time to wrap up and plan ahead');
    }
    return this.mainMessage();
  }
}

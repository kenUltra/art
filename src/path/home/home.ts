import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ThemeServices } from '../../services/theme.service';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtomDirective } from '../../directive/button.directive';

@Component({
  selector: 'home-page',
  imports: [UpperCasePipe, ButtomDirective],
  templateUrl: 'home.html',
  styleUrl: 'home.css',
})
export class HomePage {
  themeServices: ThemeServices = inject<ThemeServices>(ThemeServices);
  themSignal = signal<string>('');

  mainMessage = signal<string>('');

  constructor(private router: Router) {
    this.timeofDay();
    afterNextRender(() => {
      this.themeServices.getTheme();
      this.themeServices.themeResolver.subscribe((value) => {
        this.themSignal.set(value);
      });
    });
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

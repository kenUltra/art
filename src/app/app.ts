import { afterNextRender, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ThemeServices } from '../services/theme.service';

import { FooterComponent } from '../component/footer/footer.component';
import { HeaderComponent } from '../component/header/header.component';

import { eTheme } from '../utils/listEmun';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private platform = inject(PLATFORM_ID);
  protected readonly title = signal('art');
  themeService: ThemeServices = inject<ThemeServices>(ThemeServices);

  constructor(private titleApp: Title) {
    this.titleApp.setTitle('Art | home page');
    afterNextRender(() => {
      this.themeService.getTheme();
    });

    if (isPlatformBrowser(this.platform)) {
      const mainRoot = document.querySelector<'html'>('html') as HTMLElement;

      this.themeService.themeResolver.pipe().subscribe({
        next: (value: eTheme) => {
          if (value == eTheme.darkMode) {
            mainRoot.classList.add(eTheme.darkMode);
            mainRoot.classList.remove(eTheme.lightMode);
          } else {
            mainRoot.classList.add(eTheme.lightMode);
            mainRoot.classList.remove(eTheme.darkMode);
          }
        },
        error: (err: any) => {
          console.error('Something went wrong');
        },
      });
      Notification.requestPermission((permissionNf: NotificationPermission) => {
        return permissionNf;
      });
    }
  }
}

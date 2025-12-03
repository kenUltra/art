import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { eTheme } from '../utils/listEmun';
import { BrowserStorageService } from './storage.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeServices {
  private readonly storageTheme: string = 'os-scheme';
  private plaform = inject(PLATFORM_ID);

  private osTheme!: MediaQueryList;

  storage: BrowserStorageService = inject<BrowserStorageService>(BrowserStorageService);

  themeResolver = new BehaviorSubject<eTheme>(eTheme.darkMode);

  constructor() {
    if (isPlatformBrowser(this.plaform)) {
      this.osTheme = window.matchMedia('(prefers-color-scheme: dark)');
    }
  }

  getTheme(): string {
    let storageTheme: string;
    const baseTheme: string | null = this.storage.get(this.storageTheme);

    if (baseTheme == null) {
      this.themeResolver.next(this.isDarkMode());
      this.storage.set(this.storageTheme, this.isDarkMode());
      return this.themeResolver.value;
    }
    storageTheme = baseTheme;
    if (storageTheme == eTheme.darkMode) {
      this.themeResolver.next(eTheme.darkMode);
      this.storage.set(this.storageTheme, this.themeResolver.value);
    } else {
      this.themeResolver.next(eTheme.lightMode);
      this.storage.set(this.storageTheme, this.themeResolver.value);
    }
    this.themechange(storageTheme);

    return this.themeResolver.value;
  }

  toggleTheme(): string {
    const currentValue: string = this.storage.get(this.storageTheme) ?? '';
    if (currentValue == '') return '';
    if (currentValue == eTheme.lightMode) {
      this.themeResolver.next(eTheme.darkMode);
      this.storage.set(this.storageTheme, eTheme.darkMode);
    } else {
      this.themeResolver.next(eTheme.lightMode);
      this.storage.set(this.storageTheme, eTheme.lightMode);
    }
    return this.themeResolver.value;
  }

  private isDarkMode(): eTheme {
    return this.osTheme.matches ? eTheme.darkMode : eTheme.lightMode;
  }

  private themechange(browserValue: string): void {
    const updateTheme = () => {
      if (this.osTheme.matches) {
        this.themeResolver.next(eTheme.darkMode);
        this.storage.set(this.storageTheme, this.themeResolver.value);
      } else {
        this.themeResolver.next(eTheme.lightMode);
        this.storage.set(this.storageTheme, this.themeResolver.value);
      }
    };
    this.osTheme.addEventListener('change', updateTheme);
  }
}

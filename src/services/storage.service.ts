import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  private storage!: Storage;
  private platform = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platform)) {
      this.storage = localStorage;
    }
  }
  get(key: string): string | null {
    return this.storage.getItem(key);
  }
  set(key: string, value: any): void {
    return this.storage.setItem(key, this.changeToString(value));
  }
  remove(key: string): void {
    this.storage.removeItem(key);
  }
  updated(key: string, name: string, newValue: any): void {
    const oldValue: string = this.storage.getItem(key) ?? '';
    if (newValue == null || newValue == undefined || oldValue == '') {
      return;
    }
    const readStorage = JSON.parse(oldValue);
    readStorage[name] = newValue;
    this.storage.setItem(key, JSON.stringify(readStorage));
  }

  private changeToString(content: any): string {
    let response: string;
    switch (typeof content) {
      case 'string':
      case 'object':
        response = content.toString();
        break;
      default:
        response = JSON.stringify(content);
        break;
    }
    return response;
  }
}

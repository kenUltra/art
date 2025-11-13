import { afterNextRender, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserOSService {
  private userAgent = signal<string>('');
  private hardwareCPUcore = signal<number | undefined>(undefined);
  private osUser = signal<string>('');
  private userDevice = signal<string>('');

  constructor() {
    afterNextRender({
      write: () => {
        this.userAgent.set(window.navigator.userAgent);
        this.hardwareCPUcore.set(navigator.hardwareConcurrency);
      },
    });
  }
  getOS(): string {
    if (this.userAgent().match(/Windows/i)) {
      this.osUser.set('Windows');
    } else if (this.userAgent().match(/Linux/i)) {
      this.osUser.set('Linux');
    } else if (this.userAgent().match(/Macintosh|MacIntel/i)) {
      this.osUser.set('MacOS');
    } else if (this.userAgent().match(/Android/i)) {
      this.osUser.set('Android');
    } else if (this.userAgent().match(/iPhone|iPad|iPod/i)) {
      this.osUser.set('iOS');
    } else {
      this.osUser.set('Unknow');
    }
    return this.osUser();
  }
  getDeviceType(): string {
    if (this.userAgent().match(/Android/i) || this.userAgent().match(/iPhone|iPad|iPod/i)) {
      this.userDevice.set('Mobile');
    } else {
      this.userDevice.set('Desktop');
    }
    return this.userDevice();
  }
  cpuCore(): number | undefined {
    return this.hardwareCPUcore();
  }
}

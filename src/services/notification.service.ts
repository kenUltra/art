import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'platform',
})
export class NoticationSeriive {
  logicNf = signal<{ title: string; content?: string; tag?: string }>({ title: '' });
  notificationStatus = signal<string>('');
  path = signal<string>('/home');

  option: NotificationOptions = {
    icon: '/Art_inc_dv.png',
    silent: false,
    badge: '/Art_inc_dv.png',
    tag: this.logicNf().tag,
    lang: 'en-US',
  };
  constructor() {
    new Notification(this.logicNf().title, this.option);
    this.statusNf();
  }
  async statusNf() {
    try {
      const status: NotificationPermission = await Notification.requestPermission(
        (res: NotificationPermission) => {
          return res;
        }
      );
      this.notificationStatus.set(status);
    } catch (err) {
      console.error(err);
    }
  }
}

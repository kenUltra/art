import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'platform',
})
export class NotificationServices {
  private notificationRef: Notification;
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
  constructor(private routerPath: Router) {
    this.notificationRef = new Notification(this.logicNf().title, this.option);
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
  setttingNotificationPath(path: string): void {
    this.path.set(path);
  }
  openNotification(): void {
    this.notificationRef.addEventListener('click', () => {
      this.routerPath.navigate([this.path()]);
    });
  }
}

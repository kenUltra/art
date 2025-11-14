import { Directive, input, signal } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[notificaton-ref]',
  standalone: true,
})
export class NoticationDirective {
  private notification: Notification;
  notificationTitle = input<string>();
  tagName = input<string>();
  titleNf = signal<string>('Art inc');
  pathTarget = signal<string>('');

  notificationData: NotificationOptions = {
    silent: false,
    icon: '/icons/Art_inc_256.png',
    badge: '/icons/Art_inc_256.png',
    tag: this.tagName(),
    lang: 'en-US',
  };

  constructor(private router: Router) {
    this.notification = new Notification(
      this.notificationTitle() ?? this.titleNf(),
      this.notificationData
    );

    this.notificationTest();
  }
  private notificationTest(): void {
    try {
      this.notifiactionStatus();
    } catch (error) {
      console.error('The notifiaction is blocked', error);
    }
  }
  private async notifiactionStatus(): Promise<NotificationPermission> {
    const start = await Notification.requestPermission((value: NotificationPermission) => {
      return start;
    });
    return start;
  }
  clickNf(): void {
    this.notification.addEventListener('click', () => {
      this.router.navigate([this.pathTarget()]);
    });
  }
}

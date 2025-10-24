import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';
import { UserService } from '../../services/user.service';

import { StackComponent } from '../../component/stack/stack.component';

export interface iUserValue {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  gender: string;
  age: number;
}

@Component({
  selector: 'setting-app',
  imports: [StackComponent],
  templateUrl: 'setting.html',
  styleUrls: ['setting.css', 'setting_h.css'],
})
export class SettingPath {
  authServices = inject<AuthService>(AuthService);
  userServices = inject<UserService>(UserService);

  themeServices = inject<ThemeServices>(ThemeServices);

  themeSignal = signal<string>('');
  userValue = signal<iUserValue>({
    email: '',
    firstName: '',
    gender: '',
    lastName: '',
    userName: '',
    age: 0,
  });

  constructor(private router: Router, private titleStack: Title) {
    this.titleStack.setTitle('Settings | Art inc');
    afterNextRender(() => {
      this.themeServices.themeResolver.subscribe((value: eTheme) => {
        this.themeSignal.set(value);
      });
    });
    this.userServices.getUserData().subscribe({
      next: (res: any) => {
        this.userValue.set(res);
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        console.log('create a card loading');
      },
    });
  }

  logout(): void {
    this.authServices.logout().subscribe({
      next: (value: any) => {
        this.titleStack.setTitle('Login out user');
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        this.router.navigate(['/home']);
      },
    });
  }
}

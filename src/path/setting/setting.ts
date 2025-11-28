import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';
import { UserService } from '../../services/user.service';

import { serverStatus, StackComponent } from '../../component/stack/stack.component';
import { iStack } from '../../utils/stack';
import { PostService } from '../../services/post.service';

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
  postService = inject<PostService>(PostService);

  themeServices = inject<ThemeServices>(ThemeServices);

  themeSignal = signal<string>('');
  oldValue = signal<string>('');
  changeValue = signal<serverStatus | null>(null);

  userValue = signal<iUserValue>({
    email: '',
    firstName: '',
    gender: '',
    lastName: '',
    userName: '',
    age: 0,
  });

  changeNameValue = signal<iStack>({
    headline: 'Change user name',
    isEditable: true,
    isStackOpen: false,
    valueToChange: 'userName',
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
        this.oldValue.set(res.userName);
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {},
    });
  }
  stackClicked(value: iStack): void {
    this.changeNameValue.update((stack: iStack) => {
      return { ...stack, isStackOpen: true };
    });
  }
  backToSetting(baseValue: boolean): void {
    this.changeNameValue.update((val: iStack) => {
      return { ...val, isStackOpen: false };
    });
    this.changeValue.set(null);
  }
  updateValue(newValue: string): void {
    if (newValue.length < 3) {
      this.changeValue.set({
        isCorrect: false,
        message: 'The name that you typed is too short',
      });
      return;
    }
    this.userServices.changeUserName(newValue).subscribe({
      next: (value: any) => {
        this.titleStack.setTitle('Changing user name');
        this.postService.updateUserNamePost('person').subscribe((value) => {
          return value;
        });
        this.postService.updateCommentName(this.oldValue()).subscribe((res) => {
          return res;
        });
      },
      error: (err: HttpErrorResponse) => {
        this.titleStack.setTitle('Error happen | Art inc');
        this.changeValue.set({
          isCorrect: false,
          message: err.error.message,
        });
      },
      complete: () => {
        this.userServices.getUserData().subscribe({
          next: (value: any) => {
            this.userValue.set(value);
          },
          error: (err: HttpErrorResponse) => {
            this.router.navigate(['/home']);
          },
        });
        this.changeValue.set(null);
        this.titleStack.setTitle('User name changed');
        this.changeNameValue.update((val: iStack) => {
          return { ...val, isStackOpen: false };
        });
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

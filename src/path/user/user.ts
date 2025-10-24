import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { UserService } from '../../services/user.service';
import { ThemeServices } from '../../services/theme.service';
import { PlusComponent } from '../../component/widget/plus-icon/plus.component';

@Component({
  selector: 'user',
  imports: [PlusComponent],
  templateUrl: 'user.html',
  styleUrl: 'user.css',
})
export class UserPath {
  userService = inject<UserService>(UserService);
  themeService = inject<ThemeServices>(ThemeServices);

  artImage = computed(() => {
    const artImage: string =
      this.themeSignal() == 'dark-mode' ? '/Art_inc_dark.png' : '/Art_inc_light.png';
    return artImage;
  });

  themeSignal = signal<string>('');
  userName = signal<string>('');

  constructor(private title: Title) {
    this.title.setTitle('loading... | Art inc');
    afterNextRender({
      read: () => {
        this.themeService.themeResolver.subscribe((value) => {
          this.themeSignal.set(value);
        });
      },
    });
    this.userService.getUserData().subscribe({
      next: (value: any) => {
        this.userName.set(value.firstName + ' ' + value.lastName);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        this.title.setTitle(this.userName() + ' | Art inc');
      },
    });
  }
  themeClass(): Array<string> {
    return ['entry', this.themeSignal()];
  }
}

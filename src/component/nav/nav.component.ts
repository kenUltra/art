import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ThemeServices } from '../../services/theme.service';
import { PostService } from '../../services/post.service';

import { iPostDt } from '../../utils/auth';
import { iHeaderLinks } from '../../utils/header';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'nav-auth',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: 'nav.component.html',
  styleUrl: 'nav.component.css',
})
export class NavComponent {
  protected navVisisted: string = 'act-link';
  protected readonly navList = signal<iHeaderLinks[]>([]);

  themeService = inject<ThemeServices>(ThemeServices);
  postService = inject<PostService>(PostService);

  themeSignal = toSignal(this.themeService.themeResolver.asObservable(), { initialValue: null });
  allPost = signal<iPostDt[]>([]);

  constructor() {
    this.navList.set([
      {
        path: 'message',
        placeholder: 'Post',
      },
      {
        path: 'work',
        placeholder: 'Works',
      },
      {
        path: 'setting',
        placeholder: 'Setting',
      },
    ]);
    this.postService.listMessage.subscribe((value: iPostDt[]) => {
      this.allPost.set(value);
    });
    afterNextRender(() => {
      this.themeSignal();
    });
  }

  badgeClass(): Array<string> {
    const list: string = this.allPost().length == 0 ? '' : 'badge-on';
    return ['list', list];
  }
}

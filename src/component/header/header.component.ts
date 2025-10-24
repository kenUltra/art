import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { artPath, iHeaderLinks, listNav } from '../../utils/header';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';
import { UpperCasePipe } from '@angular/common';
import { NavDirective } from '../../directive/nav.directive';
import { TaskServices } from '../../services/task.service';
import { itask } from '../../utils/task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'art-header',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe, NavDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  protected readonly nameActiveClass: WritableSignal<string> = signal<string>('focus-page');
  protected readonly pathArt = artPath;

  private readonly themeSignal: WritableSignal<string> = signal<string>('');
  sliderNavConfig = signal<{ linkSelector: string; capsuleSelector: string }>({
    linkSelector: '.li-tab',
    capsuleSelector: '.links-bt',
  });
  navLinks: WritableSignal<iHeaderLinks[]> = listNav;

  isModalOpen: WritableSignal<boolean> = signal<boolean>(false);
  isMenuShow: WritableSignal<boolean> = signal<boolean>(false);

  private taskServices = inject<TaskServices>(TaskServices);
  private readonly authServices = inject<AuthService>(AuthService);
  badgeCount = signal<number>(0);

  refLiNav = viewChild<ElementRef[]>('linksParent');

  themeServices: ThemeServices = inject<ThemeServices>(ThemeServices);

  constructor() {
    afterNextRender(() => {
      this.themeServices.themeResolver.subscribe((value: eTheme) => {
        this.themeSignal.set(value);
      });
      this.taskServices.getAllTask();
      this.taskServices.showCaseTracker.subscribe({
        next: (value: itask[]) => {
          const count: number = value.length;
          this.badgeCount.set(count);
        },
      });
      this.authServices.isLoggedIn.subscribe((value: boolean) => {
        if (value) {
          this.navLinks.update((value: iHeaderLinks[]): iHeaderLinks[] => {
            return value.map((task: iHeaderLinks) => {
              return task.placeholder == 'Login'
                ? { ...task, path: '/user-content', placeholder: 'Profile' }
                : task;
            });
          });
        } else {
          this.navLinks.update((value: iHeaderLinks[]): iHeaderLinks[] => {
            return value.map((task: iHeaderLinks) => {
              return task.placeholder == 'Profile'
                ? { ...task, path: '/login', placeholder: 'Login' }
                : task;
            });
          });
        }
      });
    });
  }

  ngOnInit(): void {}

  // event
  toggleTheme(): void {
    this.themeServices.toggleTheme();
  }
  openSchemeMenu(): void {
    this.isModalOpen.set(!this.isModalOpen());
  }
  openMenuBtn(): void {
    this.isMenuShow.set(!this.isMenuShow());
  }
  closeMenuBtn(): void {
    this.isMenuShow.set(false);
  }

  // class
  schemeClass(baseClass: string = 'header'): Array<string> {
    return [baseClass, this.themeSignal()];
  }
  navControlButton(defaultClass: string = 'container-bx'): Array<string> {
    const btnClass: string = this.isModalOpen() ? 'show-ctx' : '';
    return [defaultClass, btnClass];
  }
  menuclass(style: string = 'mb-content'): Array<string> {
    const btnClass: string = this.isMenuShow() ? 'op-mn-ctx' : '';
    return [style, btnClass];
  }

  // logic
}

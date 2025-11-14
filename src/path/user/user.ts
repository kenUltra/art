import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { UserService } from '../../services/user.service';
import { ThemeServices } from '../../services/theme.service';
import { PlusComponent } from '../../component/widget/plus-icon/plus.component';
import { ModalComponent } from '../../component/widget/modal/modal.component';
import { iModal, iModalInput } from '../../utils/modal';
import { iPostValue, PostService } from '../../services/post.service';

@Component({
  selector: 'user',
  imports: [PlusComponent, ModalComponent],
  templateUrl: 'user.html',
  styleUrl: 'user.css',
})
export class UserPath {
  userService = inject<UserService>(UserService);
  themeService = inject<ThemeServices>(ThemeServices);
  postService = inject<PostService>(PostService);

  mainRefApi = viewChild<ElementRef<HTMLElement>>('sectionRef');

  modalBaseDt = signal<iModal>({ title: 'Base value', headTitle: 'Modal open', hasControl: true });
  postRef = signal<iModalInput>({ id: '', name: '', value: '', placeholder: '' });

  artImage = computed(() => {
    const artImage: string =
      this.themeSignal() == 'dark-mode' ? '/Art_inc_dark.png' : '/Art_inc_light.png';
    return artImage;
  });
  isModalOpen = signal<boolean>(false);

  themeSignal = signal<string>('');
  userName = signal<string>('');
  serverValue = signal<string>('');
  hasServerMessage = signal<boolean>(false);

  constructor(private title: Title) {
    this.title.setTitle('loading... | Art inc');
    afterNextRender({
      read: () => {
        const wholeBar = this.mainRefApi()?.nativeElement;
        wholeBar == undefined ? null : this.reizePage(wholeBar);
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
        console.error(err);
      },
      complete: () => {
        this.title.setTitle(this.userName() + ' | Art inc');
      },
    });
  }
  themeClass(): Array<string> {
    return ['entry', this.themeSignal()];
  }
  makePost(value: any): void {
    const postValue: iPostValue = {
      message: value.message,
      isPublic: value.isMessagePublic,
    };
    this.postService.sendPost(postValue).subscribe({
      next: (value: any) => {
        this.title.setTitle(value.firstName + " you're post is send | Art inc");
      },
      error: (errorStatus: any) => {
        this.hasServerMessage.set(true);
        this.serverValue.set(errorStatus.error?.message);
        this.title.setTitle('Error occured when posting the message');
      },
      complete: () => {
        this.title.setTitle('Post Added | Art inc');
      },
    });
  }
  openModal(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const refBtn: string = target.getAttribute('aria-placeholder') ?? '';
    this.serverValue.set('');
    this.hasServerMessage.set(false);
    if (refBtn == '') return;
    this.isModalOpen.set(true);
    if (refBtn.match(/work ref/i)) {
      this.modalBaseDt.update((value: iModal) => {
        return { ...value, title: 'The Work summary', hasControl: false, subtitle: 'Hey subtitle' };
      });
      this.postRef.set({
        id: '',
        placeholder: '',
        name: '',
        value: '',
      });
    } else {
      this.modalBaseDt.update((value: iModal) => {
        return { ...value, title: 'Post value', hasControl: true };
      });
      this.postRef.set({
        id: 'post-message',
        placeholder: 'Share what you have in mind',
        name: 'apple',
        value: 'value',
      });
    }
  }
  closeModal(): void {
    this.isModalOpen.set(false);
    this.hasServerMessage.set(false);
    this.serverValue.set('');
    this.title.setTitle(this.userName() + ' | Art inc');
  }
  reizePage(mainBar: HTMLElement): void {
    const callBackResize = (valueApi: ResizeObserverEntry[]) => {
      const targetApp: ResizeObserverEntry = valueApi[0];
      this.isModalOpen.set(false);
    };
    const apiReize = new ResizeObserver(callBackResize);
    return apiReize.observe(mainBar);
  }
}

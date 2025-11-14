import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

import { PostService } from '../../services/post.service';
import { ThemeServices } from '../../services/theme.service';

import { iPostDt } from '../../utils/auth';
import { PostComponent } from '../../component/post/post.component';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'feed-page',
  imports: [PostComponent, FormsModule],
  templateUrl: 'feed.html',
  styleUrl: 'feed.css',
})
export class FeedsPage implements AfterViewInit {
  readonly postClass: string = 'fd-pst';
  themeService = inject<ThemeServices>(ThemeServices);
  postSerice = inject<PostService>(PostService);

  rootClass = signal<string>('');
  openPostModal = signal<boolean>(false);
  hasServerResponse = signal<boolean>(false);
  serverValue = signal<string>('');
  valuePost = signal<string>('');
  postState = signal<boolean>(false);

  refHeadline = viewChild<ElementRef<HTMLDivElement>>('headlineRef');

  postSignal: Signal<iPostDt[]> = toSignal(this.postSerice.listMessage.asObservable(), {
    initialValue: [],
  });
  themetracker: Signal<string | undefined> = toSignal(this.themeService.themeResolver, {
    initialValue: undefined,
  });

  constructor(private headTitle: Title) {
    this.postSerice.getPost().subscribe((value: any) => {
      const size: string = value.length > 1 ? 's' : '';
      const headlineElement: HTMLDivElement | undefined =
        this.refHeadline()?.nativeElement ?? undefined;

      this.headTitle.setTitle('There is ' + value.length + ' post' + size + ' in total | Art inc');

      headlineElement == undefined ? null : this.addEffectNavBar(headlineElement);
    });
  }
  ngAfterViewInit(): void {
    this.headTitle.setTitle('Post feeds | Art inc');
  }
  private addEffectNavBar(target: Element): IntersectionObserver {
    const optionObs: IntersectionObserverInit = {
      threshold: 0.5,
    };
    const callBack = (entry: IntersectionObserverEntry[]) => {
      entry.forEach((value: IntersectionObserverEntry) => {
        if (value.isIntersecting) {
          this.rootClass.set('');
        } else {
          this.rootClass.set('fs-val');
        }
      });
    };

    const entry: IntersectionObserver = new IntersectionObserver(callBack, optionObs);
    entry.observe(target);
    return entry;
  }
  protected likePost(idPost: string): void {
    this.postSerice.likePost(idPost).subscribe({
      next: (res: any) => {
        console.log(res);
        this.headTitle.setTitle('Load likes... | Art inc');
        this.postSerice.getPost();
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        this.headTitle.setTitle('Post page | Art inc');
      },
    });
  }
  commentPost(value: { id: string; value: string }): void {
    if (value.value.length == 0) {
      this.headTitle.setTitle('Error No value on comment field | Art inc');
      return;
    }
    this.postSerice.commentPost(value.value, value.id).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        this.headTitle.setTitle("Post can't be send | Art inc");
      },
      complete: () => {
        this.headTitle.setTitle('Post page | Art inc');
      },
    });
  }
  postModalEvent(): void {
    this.openPostModal.set(true);
    this.hasServerResponse.set(false);
    this.serverValue.set('');
    this.headTitle.setTitle('Add Post modal | Art inc');
  }
  sendPostBtn(): void {
    const postDt = {
      message: this.valuePost(),
      isPublic: this.postState(),
    };
    if (this.valuePost().length <= 6) {
      this.serverValue.set('The value that you enter is too short');
      this.hasServerResponse.set(true);
      return;
    }
    this.hasServerResponse.set(true);
    this.postSerice.sendPost(postDt).subscribe({
      next: (value) => {
        this.serverValue.set(value.message);
      },
      error: (err: HttpErrorResponse) => {
        this.openPostModal.set(true);
        this.serverValue.set(err.message);
      },
      complete: () => {
        this.openPostModal.set(false);
        this.serverValue.set('');
        this.valuePost.set('');
        this.postState.set(false);
      },
    });
  }
  backPage(): void {
    this.openPostModal.set(false);
    this.headTitle.setTitle('Post feeds | Art inc');
  }
  classSection(baseClass: string = 'section'): Array<string> {
    const colorTheme: string = this.themetracker() ?? '';
    const modalPostOpn: string = this.openPostModal() ? 'add-pst-opn' : '';
    return [baseClass, this.rootClass(), colorTheme, modalPostOpn];
  }
  serverResponse(): Array<string> {
    const serverValue: string = this.hasServerResponse() ? 'shw-rs' : '';
    return ['res-vl-pl', serverValue];
  }
}

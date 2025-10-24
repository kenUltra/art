import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';
import { iComment, iPostDt } from '../../utils/auth';

@Component({
  selector: 'post-ui',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  themeService = inject<ThemeServices>(ThemeServices);

  postData = input.required<iPostDt>();

  currentTheme = signal<string>('');
  isCommentOpen = signal<boolean>(false);

  sendNewComment = output<string>();
  deleteCurrentPost = output<string>();
  likePostEvent = output<string>();
  parentList = viewChild.required<ElementRef<HTMLElement>>('mainParent');

  messageComment = signal<iComment[]>([]);

  constructor() {
    afterNextRender({
      read: () => {
        this.themeService.themeResolver.subscribe((value: eTheme) => {
          this.currentTheme.set(value);
        });
        this.messageComment.set(this.postData().comments);
      },
    });
  }

  showComment(): void {
    const listBar: HTMLElement = this.parentList().nativeElement;
    const li: HTMLCollection = listBar.children;

    this.isCommentOpen.set(!this.isCommentOpen());
    if (this.isCommentOpen()) {
      for (const liRef of li) {
        liRef.animate({},{})
      }
    }
  }
  // server event
  sendComment(value: string): void {
    this.sendNewComment.emit(value);
  }
  likePost(): void {
    this.likePostEvent.emit(this.postData()._id);
  }
  deletePost(): void {
    this.deleteCurrentPost.emit(this.postData()._id);
  }
  commentCls(baseclass: string = 'main-cmt-prt'): Array<string> {
    const valueComment: string = this.isCommentOpen() ? 'opn-ctx-bx' : '';
    return [baseclass, valueComment];
  }
}

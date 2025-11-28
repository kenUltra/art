import { afterNextRender, Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { eTheme } from '../../utils/listEmun';
import { iComment, iPostDt } from '../../utils/auth';
import { ThemeServices } from '../../services/theme.service';

@Component({
  selector: 'post-ui',
  imports: [UpperCasePipe, DatePipe, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  protected idString: string = 'cmt-vla-14x';
  themeService = inject<ThemeServices>(ThemeServices);
  postData = input.required<iPostDt>();

  canBeRemove = input<boolean>(false);
  stylePost = input<string>('');
  unicId = input<number>(0);

  currentTheme = signal<string>('');
  isCommentOpen = signal<boolean>(false);
  IsReplyCommentOpen = signal<boolean>(false);

  sendNewComment = output<{ id: string; value: string }>();
  deleteCurrentPost = output<string>();
  likePostEvent = output<string>();

  messageComment = signal<iComment[]>([]);
  commentValue = signal<string>('');
  countLike = computed(() => {
    this.postData();
    const count = Object.keys(this.postData().likes).length;
    return count;
  });

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
    this.isCommentOpen.set(!this.isCommentOpen());
  }
  // server event
  sendComment(): void {
    this.sendNewComment.emit({
      id: this.postData()._id,
      value: this.commentValue(),
    });
    this.commentValue.set('');
  }
  likePost(): void {
    this.likePostEvent.emit(this.postData()._id);
  }
  deletePost(): void {
    this.deleteCurrentPost.emit(this.postData()._id);
  }
  clickCommentBtn(): void {
    this.IsReplyCommentOpen.set(!this.IsReplyCommentOpen());
  }
  // style name
  commentstyle(idComment: string): Array<string> {
    const styleValue: string = this.postData().userName == idComment ? 'ow-ms' : 'nt-ms';
    return ['li-cmt', styleValue];
  }
  commentCls(baseclass: string = 'main-cmt-prt'): Array<string> {
    const valueComment: string = this.isCommentOpen() ? 'opn-ctx-bx' : '';
    return [baseclass, valueComment, this.stylePost()];
  }
  hiddenCls(baseClass: string): Array<string> {
    const openVal: string = this.IsReplyCommentOpen() ? 'reply-mdl-open' : '';
    return [baseClass, openVal];
  }
}

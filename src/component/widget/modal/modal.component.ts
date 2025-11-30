import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { ThemeServices } from '../../../services/theme.service';
import { PostService } from '../../../services/post.service';
import { eTheme } from '../../../utils/listEmun';
import { iModal, iModalInput } from '../../../utils/modal';
import { PostComponent } from '../../post/post.component';

@Component({
  selector: 'modal-app',
  imports: [FormsModule, PostComponent],
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css', 'modalStyle.component.css'],
})
export class ModalComponent implements OnInit {
  themeService = inject<ThemeServices>(ThemeServices);
  postServices = inject<PostService>(PostService);

  sliderRef = viewChild<ElementRef<HTMLDivElement>>('refSlder');

  modalData = input.required<iModal>();
  modalControl = input<iModalInput>();
  customClass = input<string>('');
  hasServerResponse = input<boolean>();
  serverMesage = input<string>();

  textTyped = output<{ message: string; isMessagePublic: boolean }>();
  closeModalEvent = output<string>();

  themeSignal = signal<string>('');
  inputValue = signal<string>('');
  listCap = signal<string[]>([]);
  isCorrectVal = signal<boolean>(false);

  postSignal = toSignal(this.postServices.listMessage, { initialValue: [] });
  trackSilderLocation = signal<number>(0);
  countPost = signal<number>(0);
  sliderPress = output<boolean>();

  constructor(private title: Title, private route: Router) {
    afterNextRender({
      write: () => {
        this.themeService.themeResolver.subscribe((value: eTheme) => {
          this.themeSignal.set(value);
        });
      },
    });
    this.postServices.getPost(false).subscribe({
      next: (response: any) => {
        this.title.setTitle('Threre is ' + response.length + ' sended');
      },
      error: (error: any) => {
        this.title.setTitle('Error happen');
      },
      complete: () => {
        this.title.setTitle('Check current post');
      },
    });
  }
  ngOnInit(): void {
    this.title.setTitle(this.modalData().headTitle + ' | Art inc');
    this.listCap.set(['Current Post'.toLocaleUpperCase(), 'add post'.toLocaleUpperCase()]);
  }
  getInputValue(): void {
    this.textTyped.emit({ message: this.inputValue(), isMessagePublic: this.isCorrectVal() });
    this.inputValue.set('');
    this.isCorrectVal.set(false);
    this.postServices.getPost(false);
  }
  showInfoMessage(elToshow: HTMLDivElement): void {
    elToshow.style.setProperty('--show-line', '1');
    elToshow.style.visibility = 'visible';
  }
  leaveInfoMessage(elToshow: HTMLDivElement): void {
    elToshow.style.setProperty('--show-line', '0');
    elToshow.style.visibility = 'hidden';
  }
  sliderPressed(btn: HTMLButtonElement): void {
    const ref = this.sliderRef()?.nativeElement;
    if (ref == null) {
      return;
    }
    this.sliderPress.emit(this.hasServerResponse() ?? false);
    const { offsetLeft } = btn;
    const width: number = btn.getBoundingClientRect().width;
    const tabLoc: number = Number(btn.getAttribute('tabindex'));

    ref.style.setProperty('--location-bar', offsetLeft + 'px');
    ref.style.setProperty('--size-capsule', width + 'px');
    this.trackSilderLocation.set(tabLoc);
    switch (this.trackSilderLocation()) {
      case 1:
        this.title.setTitle('Add new Post | Art inc');
        break;
      default:
        this.title.setTitle('Counting currrent Post');
        break;
    }
  }
  deleteUserPost(uuid: string): void {
    this.postServices.deletePost(uuid).subscribe({
      next: (value: any) => {
        console.log(value);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message);
      },
      complete: () => {
        this.title.setTitle('Post deleted | Art inc');
      },
    });
  }
  commentPost(value: { id: string; value: string }): void {
    const commentData: { commentValue: string; refMessage: string } = {
      commentValue: value.value,
      refMessage: value.id,
    };
    this.postServices
      .commentPost(commentData.commentValue, commentData.refMessage, false)
      .subscribe({
        next: (value: any) => {
          return value;
        },
        error: (err: HttpErrorResponse) => {
          this.title.setTitle('Error happen during posting your comment | Art  inc');
        },
        complete: () => {
          this.title.setTitle('Your comment has been added | Art inc');
        },
      });
  }
  likePost(idPost: string): void {
    const postId: string = idPost;
    this.postServices.likePost(postId).subscribe({
      next: (value: any) => {
        return value;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message);
        this.title.setTitle("Can't process to your requirest");
      },
    });
  }
  serverStyle(): Array<string> {
    const showResponse: string = this.hasServerResponse() ? 'sh-res' : 'bs-res';
    return ['message-post', showResponse];
  }
  checkPosts(): void {
    this.route.navigate(['user-content/post']);
  }
  closeModal(): void {
    this.closeModalEvent.emit('');
  }
}

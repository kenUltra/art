import { Component, signal } from '@angular/core';
import { PostComponent } from '../../component/post/post.component';
import { iPostDt } from '../../utils/auth';

@Component({
  selector: 'feed-page',
  templateUrl: 'feed.html',
  imports: [PostComponent],
})
export class FeedsPage {
  sample = signal<iPostDt>({
    _id: '',
    comments: [],
    firstName: '',
    isPublic: false,
    lastName: '',
    message: '',
    userName: '',
  });
  constructor() {}
  updateValue() {
    this.sample.update((prev) => {
      return {
        ...prev,
        firstName: 'hello',
        lastName: 'World',
        isPublic: true,
        _id: '45',
        message: 'Sample of text',
      };
    });
  }
  settingValue() {
    this.sample.set({
      _id: '45',
      comments: [],
      firstName: 'Bitch',
      isPublic: true,
      lastName: 'Slut',
      message: 'Get the Fuck out bitch',
      userName: '@fake_person',
    });
  }
}

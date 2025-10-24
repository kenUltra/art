import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'error-path',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class Error {
  protected readonly mainMessage = signal<string>('Something went wrong');
  protected typePath = signal<string>('');

  readonly isBtnClick = signal<boolean>(false);

  constructor(private title: Title, private router: Router) {
    this.typePath.set(router.url);
    this.title.setTitle('Error | Art error');
  }

  // class
  dynamicClass(title: string): Array<string> {
    return [title, this.sumCls()];
  }
  btnClick(): Array<string> {
    return ['container-error', this.isBtnClick() ? 'btn-chk' : ''];
  }
  backtToSafety() {
    this.router.navigate(['home']);
  }

  ngOnDestroy(): void {
    this.isBtnClick.set(false);
  }
  private sumCls(): string {
    return '';
  }
}

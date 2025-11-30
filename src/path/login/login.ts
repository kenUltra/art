import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ThemeServices } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

import { eTheme } from '../../utils/listEmun';
import { epasswordType, iLog } from '../../utils/auth';
import { UserOSService } from '../../services/useros.service';

@Component({
  selector: 'login-app',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formBuilder = inject<FormBuilder>(FormBuilder);
  themeServices = inject<ThemeServices>(ThemeServices);
  authServives = inject<AuthService>(AuthService);
  userOSUser = inject<UserOSService>(UserOSService);

  protected readonly headline = signal<string>('Sign in to Art');
  protected readonly messsageServer = signal<string>('');

  submitLinkActive = signal<Boolean>(true);
  submitterName = signal<string>('Sign in');

  showPassword = signal<boolean>(true);
  themeSignal = signal<string>('');
  hasServerReq = signal<boolean | null>(null);

  readonly pwdType = signal<epasswordType>(epasswordType.password);
  formOk = '';

  formControl = this.formBuilder.group({
    email: new FormControl<string>('', [Validators.requiredTrue]),
    password: new FormControl<string>('', [Validators.requiredTrue]),
  });

  constructor(private title: Title, private meta: Meta, private router: Router) {
    this.title.setTitle('Sign in | Art inc');
    this.meta.addTag({
      name: '',
      property: '',
    });
    afterNextRender({
      read: () => {
        this.themeServices.getTheme();
      },
    });
    this.themeServices.themeResolver.subscribe({
      next: (value: eTheme) => {
        this.themeSignal.set(value);
        return value;
      },
      error: (error: any) => {
        console.warn('The content is not the best, due to: ', error);
        this.themeSignal.set('tm-error');
      },
    });
    this.formControl.valueChanges.subscribe((value) => {
      if (!value.email?.match(/\S+@\S+\.\S+/i) || value.password?.length == 0) {
        this.submitLinkActive.set(true);
        return;
      }
      this.submitLinkActive.set(false);
    });
    this.messsageServer.set('');
  }

  // submit
  loginEntry(subEvent: SubmitEvent): void {
    if (subEvent.submitter?.role == undefined || subEvent.submitter.role == 'button') {
      return;
    }
    this.submitLinkActive.set(true);
    this.submitterName.set('Pending...');

    const mailReg: RegExp = /\S+@\S+\.\S+/;
    const sub: string | null | undefined = subEvent.submitter?.role,
      valueForm: iLog = {
        email: this.formControl.value.email ?? '',
        password: this.formControl.value.password ?? '',
        currentOS: this.userOSUser.getOS(),
      };
    if (sub == null || sub == undefined || sub == 'button') {
      return;
    }
    if (!mailReg.test(valueForm.email)) {
      this.messsageServer.set('Only use a valid email');
      return;
    }
    this.authServives.logUser(valueForm).subscribe({
      next: (value: any) => {
        this.messsageServer.set('Success pending to auth data');
        this.hasServerReq.set(true);
      },
      error: (err: any) => {
        this.messsageServer.set(err.error?.error);
        this.hasServerReq.set(false);
        this.submitLinkActive.set(false);
        this.submitterName.set('Sign in');
      },
      complete: () => {
        this.messsageServer.set('Redirect to your account');
        this.router.navigate(['/user-content']);
        this.submitLinkActive.set(true);
        this.submitterName.set('Sign in');
      },
    });
    this.formControl.setValue({ email: '', password: '' });
  }
  pwdBtn(): void {
    this.showPassword.set(!this.showPassword());
    if (this.showPassword()) {
      this.pwdType.set(epasswordType.text);
      return;
    }
    this.pwdType.set(epasswordType.password);
  }
  signupPage(): void {
    this.router.navigate(['/sign-up']);
  }

  // class
  themeClass(): Array<string> {
    return ['section', 'login'];
  }
  messageResponse(): Array<string> {
    const messageRes =
      this.hasServerReq() == null ? '' : this.hasServerReq() ? 'k-data' : 'err-data';
    return ['wrapper-msg-bar', messageRes];
  }
}

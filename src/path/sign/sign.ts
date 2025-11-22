import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ThemeServices } from '../../services/theme.service';
import { eTheme } from '../../utils/listEmun';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { iuserData } from '../../utils/auth';
import { UserOSService } from '../../services/useros.service';
import { NotificationCenter } from '../../utils/notification';

export enum Egender {
  notGender = '',
  male = 'Male',
  female = 'Female',
}

@Component({
  selector: 'sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: 'sign.html',
  styleUrl: 'sign.css',
})
export class SignPath {
  protected readonly notice = signal<string>('By clicking on sign up buttom you accept our: ');
  protected currentTheme = signal<eTheme | null>(null);
  protected readonly linkSign = signal<string>('sign-in');
  protected serverMessage = signal<string>('');
  protected isResponseSuccess = signal<boolean | null>(null);

  isConfirnPassShowed = signal<boolean>(false);
  isPasswordShowed = signal<boolean>(false);
  isSubmitBtnActive = signal<boolean>(true);

  formBuilder = inject<FormBuilder>(FormBuilder);
  themeServices = inject<ThemeServices>(ThemeServices);
  router = inject<Router>(Router);

  authService = inject<AuthService>(AuthService);
  osUserService = inject<UserOSService>(UserOSService);

  formControls = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required, Validators.min(19), Validators.max(100)]),
    gender: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.pattern(/\S+@\S+\.\S+/),
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confimPass: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  constructor(private title: Title) {
    this.title.setTitle('Create Art acoount');
    afterNextRender(() => {
      this.themeServices.themeResolver.subscribe((value: eTheme) => {
        this.currentTheme.set(value);
      });
    });

    this.formControls.valueChanges.subscribe((value) => {
      const userAge: number = Number(value.age);
      const allowedAge: boolean = userAge >= 19 || userAge <= 100;

      function pwdlenght(target: undefined | number): boolean {
        const res: boolean = target == undefined ? false : target >= 8;
        return res;
      }

      if (
        value.firstName?.length !== 0 &&
        value.lastName?.length !== 0 &&
        allowedAge &&
        value.gender !== '' &&
        value.userName?.length !== 0 &&
        pwdlenght(value.password?.length) &&
        pwdlenght(value.confimPass?.length) &&
        value.email?.length !== 0
      ) {
        this.isSubmitBtnActive.set(false);
        return;
      }
      if (this.formControls.controls.email.hasError('pattern')) {
        this.isSubmitBtnActive.set(false);
        this.serverMessage.set('The email that you typed is invalid');
        this.isResponseSuccess.set(false);
      } else {
        this.isResponseSuccess.set(null);
        this.serverMessage.set('');
      }

      this.isSubmitBtnActive.set(true);
    });
  }
  showPassBtn(primaryPassword: boolean = false): void {
    if (!primaryPassword) {
      this.isConfirnPassShowed.set(!this.isConfirnPassShowed());
      return;
    }
    this.isPasswordShowed.set(!this.isPasswordShowed());
  }
  createAccount(event: SubmitEvent): void {
    const submiterBtn: string | null = event.submitter?.role ?? null;
    const currentValue = this.formControls.getRawValue();
    const ageTyped: number = Number(currentValue.age);
    const passwordMatches: boolean = currentValue.password === currentValue.confimPass;

    if (submiterBtn == null) {
      return;
    }
    if (ageTyped < 19 || ageTyped > 100) {
      this.serverMessage.set('Invalid age');
      this.isResponseSuccess.set(false);
      return;
    }
    if (currentValue.password?.length == undefined || currentValue.password.length <= 6) {
      this.serverMessage.set('The password that you have typed is too smal');
      this.isResponseSuccess.set(false);
      return;
    }
    if (!passwordMatches) {
      this.serverMessage.set("The password doesn't matches");
      this.isResponseSuccess.set(false);
      return;
    }
    const valueToProccess: iuserData = {
      firstName: currentValue.firstName ?? '',
      lastName: currentValue.lastName ?? '',
      userName: currentValue.userName ?? '',
      age: Number(currentValue.age),
      email: currentValue.email ?? '',
      gender: currentValue.gender ?? '',
      password: currentValue.password ?? '',
      hostOS: this.osUserService.getOS(),
      userHardware: this.osUserService.getDeviceType(),
    };
    this.authService.createUser(valueToProccess).subscribe({
      next: (value: any) => {
        const responseRerver = value.messsage;
        this.isResponseSuccess.set(true);
        NotificationCenter(
          responseRerver,
          'You can log anytine you like.',
          undefined,
          '/user-content'
        );
      },
      error: (err: any) => {
        console.error('Trouble happen in: ', err);
        this.isResponseSuccess.set(false);
        if (err.error?.error) {
          this.serverMessage.set(err.error.error);
          return;
        }
        if (err.error?.message) {
          this.serverMessage.set(err.error.messsage);
          return;
        }
        this.serverMessage.set(err.name + ' ' + err.statusText);
      },
      complete: () => {
        this.serverMessage.set('Created without any issues');
        this.router.navigate(['/user-content']);
      },
    });
    this.formControls.setValue({
      age: '',
      confimPass: '',
      gender: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      userName: '',
    });
  }
  signPage(): void {
    this.router.navigate([this.linkSign()]);
  }

  // ui class
  themeClass(): Array<string> {
    const mainTheme: string = this.currentTheme() == null ? '' : this.currentTheme() ?? '';
    return ['section', mainTheme];
  }
  serverclass(): Array<string> {
    const serverValue: string =
      this.isResponseSuccess() == null
        ? ''
        : this.isResponseSuccess()
        ? 'valid-res'
        : 'invalid-res';
    return ['prt-sm', serverValue];
  }
}

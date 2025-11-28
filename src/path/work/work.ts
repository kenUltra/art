import { Component, inject, signal, Signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ThemeServices } from '../../services/theme.service';
import { EmployeeServices } from '../../services/employee.service';
import { eTheme } from '../../utils/listEmun';
import { iEmployee, listCurrency } from '../../utils/empoyee_lst';
import { Inputcomponent } from '../../component/widget/input/input.component';
import { inputWork } from '../../utils/employee';
import { LoadComponent } from '../../component/widget/load/load.component';

export interface serverValue {
  hasResponse: null | boolean;
  message: string;
  isSuccess: boolean;
}

@Component({
  selector: 'work-path',
  imports: [ReactiveFormsModule, Inputcomponent, LoadComponent],
  templateUrl: 'work.html',
  styleUrl: 'work.css',
})
export class WorkPath {
  themeServive = inject<ThemeServices>(ThemeServices);
  workSerice = inject<EmployeeServices>(EmployeeServices);
  employeeBuilder = inject<FormBuilder>(FormBuilder);

  baseInputCls = 'bx-txt';
  loadText = "Loading...";
  employeeCtrl = signal<Array<inputWork>>([]);
  buttonDisable = signal<boolean>(true);

  currentScheme: Signal<eTheme | undefined> = toSignal<eTheme>(
    this.themeServive.themeResolver.asObservable(),
    {
      initialValue: undefined,
    }
  );

  serverResponse = signal<serverValue>({
    hasResponse: null,
    message: '',
    isSuccess: false,
  });

  isModalOpen = signal<boolean>(false);
  employeeDetail: Signal<iEmployee | null> = toSignal(this.workSerice.employeeStatus, {
    initialValue: null,
  });

  employeeForm = this.employeeBuilder.group({
    companyName: new FormControl<string>('', [Validators.required]),
    position: new FormControl<string>('', [Validators.required]),
    phoneNumber: new FormControl<string>('', [Validators.required]),
    salary: new FormControl<string>('', [Validators.required, Validators.min(0)]),
    colleges: new FormControl<string>('', []),
    currency: new FormControl<string>(listCurrency.dollar ?? '', [Validators.required]),
    headQ: new FormControl<string>('', [Validators.required]),
    website: new FormControl<string>('', [Validators.required]),
    hiredDate: new FormControl<string>('', [Validators.required]),
  });

  submmitTxt = signal<string>('submit');

  constructor(private title: Title, private router: Router) {
    this.workSerice.getEmployee().subscribe({
      next: (value) => {
        return value;
      },
      error: (err: HttpErrorResponse) => {
        this.title.setTitle('Error: ' + err.statusText + ' | Art inc');
      },
      complete: () => {
        this.title.setTitle('Work status | Art inc');
      },
    });
    this.employeeForm.valueChanges.subscribe((vlChange) => {
      const phoneNumb: string = vlChange.phoneNumber ?? '';
      const rangeSalary: number = Number(vlChange.phoneNumber);

      this.serverResponse.set({ hasResponse: null, isSuccess: false, message: '' });

      if (
        vlChange.headQ?.length == 0 ||
        vlChange.companyName?.length == 0 ||
        vlChange.website?.length == 0 ||
        vlChange.position?.length == 0 ||
        vlChange.salary?.length == 0 ||
        vlChange.website?.length == 0 ||
        vlChange.hiredDate == null
      ) {
        this.buttonDisable.set(true);
        return;
      }

      if (phoneNumb.length !== 0) {
        const notAllowed: string[] = [
          ...'qwertyuiop[]asdfghjkl;\'\\zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:"|ZXCVBNM<>?!@#$%^&*()*/._=',
        ];
        for (const check of notAllowed) {
          if (phoneNumb.includes(check)) {
            this.serverResponse.set({
              hasResponse: true,
              isSuccess: false,
              message: 'Only a valid phone number',
            });
            return this.buttonDisable.set(true);
          }
        }
      }
      if (rangeSalary < 0) {
        this.serverResponse.set({
          hasResponse: true,
          isSuccess: false,
          message: "Don't enter a negative value on your salary",
        });
        return this.buttonDisable.set(true);
      }
      return this.buttonDisable.set(false);
    });

    this.employeeCtrl.set([
      {
        id: 'position',
        isMenu: false,
        name: 'user-position',
        placeholder: 'AI enginner',
        type: 'text',
        label: 'Your current position',
        formName: 'position',
        entryForm: this.employeeForm,
      },
      {
        id: 'company',
        isMenu: false,
        name: 'company-name',
        placeholder: 'Apple or OpenAI',
        type: 'text',
        label: 'Entreprise name',
        formName: 'companyName',
        entryForm: this.employeeForm,
      },
      {
        id: 'phone',
        isMenu: false,
        name: 'phone-number',
        placeholder: '408 996-1030',
        type: 'tel',
        label: 'Your phone number',
        formName: 'phoneNumber',
        entryForm: this.employeeForm,
        autoComplte: 'tel-national',
      },
      {
        id: 'url-company',
        isMenu: false,
        name: 'link',
        placeholder: 'apple.com',
        type: 'text',
        label: 'The company website',
        formName: 'website',
        entryForm: this.employeeForm,
      },
      {
        id: 'address',
        isMenu: false,
        name: 'company-address',
        placeholder: 'One Apple Park Way Cupertino CA 95014 United States',
        type: 'text',
        label: 'Headquarter company',
        entryForm: this.employeeForm,
        formName: 'headQ',
        autoComplte: 'street-address',
      },
      {
        id: 'salary',
        isMenu: false,
        name: 'salary-stack',
        placeholder: 'Your curent salary',
        type: 'number',
        label: 'Salary',
        formName: 'salary',
        entryForm: this.employeeForm,
      },
    ]);
  }
  addWorkDetail(): void {
    this.isModalOpen.set(true);
  }
  removeModal(): void {
    this.isModalOpen.set(false);
  }
  modalCls(): Array<string> {
    const opn: string = this.isModalOpen() ? 'sh-mdl' : 'n-mdl';
    return ['wk-ln', opn];
  }
  maskClass(): Array<string> {
    const opn: string = this.isModalOpen() ? 'sh-msk' : 'n-msk';
    return ['mask-ent', opn];
  }
  mainClass(): Array<string> {
    const theme: string = this.currentScheme() ?? '';
    return ['section', theme];
  }
  serverClassName(): Array<string> {
    const valueServer: string =
      this.serverResponse().hasResponse == null
        ? ''
        : this.serverResponse().isSuccess
        ? 'crt-rs'
        : 'n-crt-rs';
    return ['srv-status', valueServer];
  }
  submitingValue(): void {
    const typedValue = this.employeeForm.getRawValue();
    const money = () => {
      let res: listCurrency;
      switch (typedValue.currency) {
        case 'EUR':
          res = listCurrency.euro;
          break;
        case 'GDP':
          res = listCurrency.pound;
          break;
        default:
          res = listCurrency.euro;
          break;
      }
      return res;
    };

    const value: iEmployee = {
      position: typedValue.position ?? '',
      companyName: typedValue.companyName ?? '',
      currency: money(),
      headQuarter: typedValue.headQ ?? '',
      phoneNumber: typedValue.phoneNumber?.replaceAll(' ', '_pth_') ?? '',
      salary: Number(typedValue.salary),
      website: typedValue.website ?? '',
      coworker: [],
      hiredDate: new Date(typedValue.hiredDate ?? '') ?? new Date(),
    };

    this.submmitTxt.set('Pending...');
    this.workSerice.createEmployee(value).subscribe({
      next: (res) => {
        console.log(res);
        this.workSerice.getEmployee().subscribe((content) => {
          return content;
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.submmitTxt.set('Error try again');
        this.serverResponse.set({
          hasResponse: true,
          isSuccess: false,
          message: err.error?.message,
        });
      },
      complete: () => {
        this.title.setTitle('Info added | Art inc');
        this.isModalOpen.set(false);
        this.submmitTxt.set('Submit');
      },
    });
  }
}

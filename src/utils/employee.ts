import { FormGroup } from '@angular/forms';

export interface iEmployeeValue {
  position: string;
  phoneNumber: number;
  hiredDate: Date;
  salary: number;
  curreny: eCurrency;
  companyName: string;
  headQ: string;
  website: string;
  colleges: Array<any>;
}
export enum eCurrency {
  Dollar = 'USD',
  Euro = 'EUR',
  SterlingPound = 'GDP',
}
export interface inputWork {
  type: string | number;
  placeholder: string;
  id: string;
  isMenu: boolean;
  name: string;
  formName: string;
  label?: string;
  autoComplte?: string;
  entryForm: FormGroup<any>;
}

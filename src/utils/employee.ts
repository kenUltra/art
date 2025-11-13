export interface iEmployee {
  position: string;
  phoneNumber: number;
  hiredDate: Date;
  salary: DoubleRange;
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

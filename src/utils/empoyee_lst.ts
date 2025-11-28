export interface iEmployee {
  position: string;
  companyName: string;
  website: string;
  headQuarter: string;
  salary: number;
  phoneNumber: string;
  coworker?: Array<string>;
  currency: listCurrency;
  hiredDate: Date;
}

export enum listEmployee {
  interShip = 'Intern',
  vicePresident = 'Vice President',
  seniorVicePresident = 'Senior Vice president',
  chiefExecutice = 'CEO',
  chiefFinamce = 'CFO',
  namager = 'Manager',
  basicEmployee = 'Employee',
}
export enum listCurrency {
  dollar = 'USD',
  euro = 'EUR',
  pound = 'GDP',
}

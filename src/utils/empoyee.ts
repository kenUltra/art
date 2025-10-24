export interface iEmployee {
  position: listEmployee;
  companyName: string;
  webiste: string;
  headQuarter: string;
  salary: number;
  phoneNumber: number;
  coworker?: Array<string>;
  currency: listCurrency;
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
  dollar = 'USB',
  euro = 'EUR',
  pound = 'GDP',
}

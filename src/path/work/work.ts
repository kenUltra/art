import { Component, inject, Signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { ThemeServices } from '../../services/theme.service';
import { EmployeeServices } from '../../services/employee.service';
import { eTheme } from '../../utils/listEmun';

@Component({
  selector: 'work-path',
  imports: [],
  templateUrl: 'work.html',
})
export default class WorkPath {
  themeServive = inject<ThemeServices>(ThemeServices);
  workSerice = inject<EmployeeServices>(EmployeeServices);

  currentScheme: Signal<eTheme | undefined> = toSignal<eTheme>(
    this.themeServive.themeResolver.asObservable(),
    {
      initialValue: undefined,
    }
  );

  employeeDetail = toSignal(this.workSerice.employeeStatus.asObservable(), { initialValue: null });

  constructor(private title: Title) {
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
  }
  mainClass(): Array<string> {
    const theme: string = this.currentScheme() ?? '';
    return ['section', theme];
  }
}

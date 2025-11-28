import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

import { APP_SETTINGS } from '../app/app.setting';
import { BrowserStorageService } from './storage.service';
import { iEmployee } from '../utils/empoyee_lst';

@Injectable({ providedIn: 'root' })
export class EmployeeServices {
  private readonly tokenVl = 'access';
  private readonly backendSetting = inject(APP_SETTINGS);

  employeeStatus: BehaviorSubject<iEmployee | null> = new BehaviorSubject<iEmployee | null>(null);

  private readonly url: string =
    this.backendSetting.apiUrl + '/' + this.backendSetting.backendVersion;

  private browserService = inject<BrowserStorageService>(BrowserStorageService);

  private authValue: string = `Bearer ${this.getAccessValue().acToken}`;
  private userID: string = this.getAccessValue().refUuid;

  constructor(private http: HttpClient) {}

  getEmployee(): Observable<{
    nessage: string;
    employeeDetail: any;
  }> {
    return this.http
      .get<{ nessage: string; employeeDetail: any }>(this.url + '/employee/' + this.userID, {
        headers: {
          Authentication: this.authValue,
        },
        credentials: 'include',
      })
      .pipe(
        tap((res) => {
          const detail: iEmployee = res.employeeDetail;
          this.employeeStatus.next(detail);
          return detail;
        }),
        catchError(this.httpError)
      );
  }
  createEmployee(employeeInfo: iEmployee): Observable<{
    message: string;
    status: string;
  }> {
    return this.http
      .post<{ message: string; status: string }>(
        this.url + '/employee/' + this.userID,
        employeeInfo,
        {
          headers: {
            Authentication: this.authValue,
          },
          withCredentials: true,
        }
      )
      .pipe(
        tap((res: any) => {
          this.employeeStatus.next(res);
          return res;
        }),
        catchError(this.httpError)
      );
  }
  addCoworker(listColleges: Array<string>) {
    return this.http
      .put(
        this.url + '/employee/' + this.userID,
        {
          coworker: listColleges,
        },
        {
          headers: {
            Authentication: this.authValue,
          },
          withCredentials: true,
        }
      )
      .pipe(
        tap((value) => {
          return value;
        }),
        catchError(this.httpError)
      );
  }

  private getAccessValue(): any {
    const valueAccess = JSON.parse(this.browserService.get(this.tokenVl) ?? '');
    return valueAccess;
  }
  private httpError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}

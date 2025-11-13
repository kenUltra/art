import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { BrowserStorageService } from './storage.service';
import { APP_SETTINGS } from '../app/app.setting';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly localStorageRef: string = 'access';
  private readonly backendURl = inject(APP_SETTINGS);

  private readonly urlServer: string =
    this.backendURl.apiUrl + '/' + this.backendURl.backendVersion;

  private localStr = inject<BrowserStorageService>(BrowserStorageService);
  private authService = inject<AuthService>(AuthService);

  constructor(private http: HttpClient) {}
  getUserData(): Observable<any> {
    const storageValue = JSON.parse(this.localStr.get(this.localStorageRef) ?? '');

    this.authService.accessPage.set(storageValue.acToken);
    return this.http
      .get<any>(this.urlServer + '/pages/' + storageValue.refUuid, {
        headers: {
          Authentication: `Bearer ${storageValue.acToken}`,
        },
        withCredentials: true,
      })
      .pipe(
        map((value) => {
          return value;
        }),
        catchError(this.httpErrorHandle)
      );
  }
  changeUserName(newName: string): Observable<any> {
    const userStoreId = JSON.parse(this.localStr.get(this.localStorageRef) ?? '');
    return this.http.patch<any>(
      this.backendURl + '/pages/' + userStoreId.refUuid,
      { userName: newName },
      {
        headers: {
          Authentication: `Bearer ${this.authService.accessPage()}`,
        },
        withCredentials: true,
      }
    );
  }
  private httpErrorHandle(error: HttpErrorResponse) {
    let response: string = '';

    switch (error.status) {
      case HttpStatusCode.InternalServerError:
        response = 'Error server';
        break;
      case HttpStatusCode.BadRequest:
        response = 'Bad request';
        break;
      case HttpStatusCode.Conflict:
        response = 'Same thing not allowed happen';
        break;
      default:
        response = 'Unkown error';
        break;
    }
    return throwError(() => error);
  }
}

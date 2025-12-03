import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { APP_SETTINGS } from '../app/app.setting';
import { iLog, iuserData, logToken } from '../utils/auth';
import { BrowserStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenRef: string = 'access';
  private platform = inject(PLATFORM_ID);

  isLoggedIn = new BehaviorSubject<boolean>(false);

  storageService = inject<BrowserStorageService>(BrowserStorageService);

  accessPage = signal<string>('');
  private userId = signal<string>('');

  private readonly backendURL = inject(APP_SETTINGS);
  private readonly url: string = this.backendURL.apiUrl + '/' + this.backendURL.backendVersion;

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platform)) {
      const contentRef: string | null = this.storageService.get(this.tokenRef);
      contentRef == null ? this.isLoggedIn.next(false) : this.isLoggedIn.next(true);
    }
  }
  logUser(logValue: iLog): Observable<logToken> {
    return this.http
      .post<logToken>(this.url + '/auth', logValue, {
        headers: { 'Content-type': 'application/json' },
        credentials: 'include',
      })
      .pipe(
        tap((token: logToken) => {
          token.access ? this.isLoggedIn.next(true) : this.isLoggedIn.next(false);
          this.accessPage.set(token.access);
          this.userId.set(token.user);
          this.storageService.remove(this.tokenRef);
          this.storageService.set(
            this.tokenRef,
            JSON.stringify({
              isUserActive: true,
              refUuid: this.userId(),
              acToken: token.access,
            })
          );
          return token;
        }),
        catchError(this.httpErrorHandle)
      );
  }

  getContent(): Observable<any> {
    return this.http.get<any>(this.url + '/refresh', { credentials: 'include' }).pipe(
      tap((value: any) => {
        return value;
      }),
      catchError(this.httpErrorHandle)
    );
  }
  logout() {
    const authDt = this.readJSON(this.storageService.get(this.tokenRef) ?? '');
    return this.http
      .get<any>(this.url + '/auth/logout', {
        headers: {
          Authentication: `Bearer ${authDt.acToken}`,
        },
        withCredentials: true,
      })
      .pipe(
        map((value: any) => {
          this.storageService.remove(this.tokenRef);
          this.isLoggedIn.next(false);
          this.accessPage.set('');
          this.userId.set('');
          return value;
        }),
        catchError(this.httpErrorHandle)
      );
  }
  createUser(userValue: iuserData): Observable<any> {
    return this.http
      .post<any>(this.url + '/user', userValue, {
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      })
      .pipe(
        tap((value) => {
          this.accessPage.set(value.access);
          this.isLoggedIn.next(true);
          this.userId.set(value.user);
          this.storageService.remove(this.tokenRef);
          this.storageService.set(
            this.tokenRef,
            JSON.stringify({
              acToken: value.access,
              refUuid: this.userId(),
            })
          );
          return value;
        }),
        catchError(this.httpErrorHandle)
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
  private readJSON(value: string): any {
    return JSON.parse(value);
  }
}

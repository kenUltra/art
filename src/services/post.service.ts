import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { APP_SETTINGS } from '../app/app.setting';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { BrowserStorageService } from './storage.service';
import { iPostDt } from '../utils/auth';

export interface iPostValue {
  message: string;
  isPublic: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly userToken: string = 'access';

  private readonly userData = inject(BrowserStorageService);
  private readonly backendUrl = inject(APP_SETTINGS).apiUrl;
  private readonly version = inject(APP_SETTINGS).backendVersion;

  listMessage = new BehaviorSubject<Array<iPostDt>>([]);

  private readonly backend: string = this.backendUrl + '/' + this.version;

  userUUID = signal<string>('');
  accessToken = signal<string>('');

  constructor(private http: HttpClient) {
    const storageValue = this.readJSON(this.userData.get(this.userToken) ?? '');
    const userID: string = storageValue.refUuid;
    const token: string = storageValue.acToken;
    this.userUUID.set(userID);
    this.accessToken.set(token);
  }
  getPost(): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');

    return this.http
      .get<any>(this.backend + '/posts/' + this.userUUID(), {
        headers: {
          Authentication: `Bearer ${storage.acToken}`,
        },
        withCredentials: true,
      })
      .pipe(
        map((value): iPostDt[] => {
          const mergeValue: Array<iPostDt> = value.content;
          const publicContent: Array<iPostDt> = value.publicMessage;
          const conbineValue: iPostDt[] = [...mergeValue, ...publicContent];

          this.listMessage.next(conbineValue);
          return this.listMessage.value;
        }),
        catchError(this.httpError)
      );
  }
  sendPost(value: iPostValue): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');
    return this.http
      .post(this.backend + '/posts/' + this.userUUID(), value, {
        headers: {
          'Content-type': 'application/json',
          Authentication: 'Bearer ' + storage.acToken,
        },
        withCredentials: true,
      })
      .pipe(
        tap((data: any) => {
          this.getPost().subscribe((value) => {
            this.listMessage.next(value);
          });
          return data;
        }),
        catchError(this.httpError)
      );
  }
  likePost(postID: string): Observable<any> {
    const likeRef = {
      postId: postID,
    };
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');

    return this.http
      .patch(this.backend + '/posts/' + this.userUUID(), likeRef, {
        withCredentials: true,
        headers: {
          'Content-type': 'application/json',
          Authentication: 'Bearer ' + storage.acToken,
        },
      })
      .pipe(
        tap((value: any) => {
          return value;
        }),
        catchError(this.httpError)
      );
  }
  deletePost(postId: string): Observable<any> {
    return this.http.delete(this.backend + '/posts/' + postId, {
      headers: {
        'Content-type': 'application/json',
        Authentication: 'Bearer ' + this.accessToken(),
      },
    });
  }
  commentPost(commentValue: string, refMessage: string): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');

    return this.http
      .post(
        this.backend + '/comment/' + this.userUUID(),
        { comment: commentValue },
        {
          headers: {
            'Content-type': 'application/json',
            Authentication: 'Bearer ' + storage.acToken,
          },
          params: {
            refMessage: refMessage,
          },
        }
      )
      .pipe(
        map((value: any) => {
          return value;
        }),
        catchError(this.httpError)
      );
  }

  private httpError(err: HttpErrorResponse) {
    return throwError(() => err);
  }
  private readJSON(value: string): any {
    return JSON.parse(value);
  }
}

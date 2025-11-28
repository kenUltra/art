import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';

import { APP_SETTINGS } from '../app/app.setting';
import { BrowserStorageService } from './storage.service';
import { iPostDt } from '../utils/auth';

export interface iPostValue {
  message: string;
  isPublic: boolean;
  seeALLResponse: boolean;
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
  getPost(getAllPost: boolean = true): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');

    return this.http
      .get<any>(this.backend + '/post/' + storage.refUuid, {
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
          return this.listMessage.getValue();
        }),
        tap((post: iPostDt[]) => {
          const value = post.filter((value: iPostDt) => {
            return value.user == storage.refUuid;
          });
          getAllPost ? this.listMessage.next(post) : this.listMessage.next(value);
          return this.listMessage.getValue();
        }),

        catchError(this.httpError)
      );
  }
  sendPost(value: iPostValue): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');
    return this.http
      .post(this.backend + '/post/' + storage.refUuid, value, {
        headers: {
          'Content-type': 'application/json',
          Authentication: 'Bearer ' + storage.acToken,
        },
        withCredentials: true,
      })
      .pipe(
        tap((data: any) => {
          this.getPost(value.seeALLResponse).subscribe((value) => {
            this.listMessage.next(value);
          });
          return data;
        }),
        catchError(this.httpError)
      );
  }
  updateUserNamePost(newName: string) {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');
    return this.http
      .patch(
        this.backend +
          '/post/' +
          storage.refUuid +
          '?applychange=true&key=485ct87r578tcd&maxValue=23',
        { apply: newName },
        {
          headers: {
            'Content-type': 'application/json',
            Authentication: 'Bearer ' + storage.acToken,
          },
          withCredentials: true,
        }
      )
      .pipe(
        tap((response: any) => {
          return response;
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
      .patch(this.backend + '/post/like/' + storage.refUuid, likeRef, {
        withCredentials: true,
        headers: {
          'Content-type': 'application/json',
          Authentication: 'Bearer ' + storage.acToken,
        },
      })
      .pipe(
        tap((value: any) => {
          this.getPost().subscribe((value) => {
            return value;
          });
          return value;
        }),
        catchError(this.httpError)
      );
  }
  deletePost(postId: string): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');

    return this.http
      .delete(this.backend + '/post/' + postId, {
        headers: {
          'Content-type': 'application/json',
          Authentication: 'Bearer ' + storage.acToken,
        },
      })
      .pipe(
        tap((value) => {
          this.getPost(false).subscribe((res) => {
            return res;
          });
          return value;
        }),
        catchError(this.httpError)
      );
  }
  commentPost(
    commentValue: string,
    refMessage: string,
    showAllPost: boolean = true
  ): Observable<any> {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');

    return this.http
      .post(
        this.backend + '/comment/' + storage.refUuid,
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
          this.getPost(showAllPost).subscribe((value) => {
            return value;
          });
          return value;
        }),
        catchError(this.httpError)
      );
  }
  updateCommentName(oldName: string) {
    const storage = this.readJSON(this.userData.get(this.userToken) ?? '');
    return this.http
      .patch(
        this.backend + '/comment/person/' + storage.refUuid,
        { action: 'change value', oldName: oldName },
        {
          headers: {
            'Content-type': 'application/json',
            Authentication: 'Bearer ' + storage.acToken,
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

  private httpError(err: HttpErrorResponse) {
    return throwError(() => err);
  }
  private readJSON(value: string): any {
    return JSON.parse(value);
  }
}

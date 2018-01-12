import { Injectable } from '@angular/core';

import { UserModel } from './user-model';
import { isNullOrUndefined } from 'util';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UserAuthService {

  onAuthChange$: Subject<UserModel>;

  constructor() { this.onAuthChange$ = new Subject(); }

  setCurrentUser(user: UserModel) {
    this.onAuthChange$.next(user);
    const userString = JSON.stringify(user);
    localStorage.setItem('currentUser', userString);
  }

  getCurrentUser(): UserModel {
    const userString = localStorage.getItem('currentUser');
    if (!isNullOrUndefined(userString)) {
      const user: UserModel = JSON.parse(userString);
      return user;
    } else {
      return null;
    }
  }

  setToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  logOut() {
    this.onAuthChange$.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
  }

}

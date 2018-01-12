import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { UserAuthService } from './user-auth.service';
import { UserModel } from './user-model';
//import { JSONSearchParams } from './search.params';

@Injectable()
export class UserService {

  private header: Headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': this.userAuth.getToken(),
  });

  private serverUrl = 'http://127.0.0.1:3000/api';
  // private serverUrl = '/api';

  constructor(private http: Http, private userAuth: UserAuthService) { }

  logIn(eml: string, pswrd: string): Observable<any> {
    const url = this.serverUrl + '/clients/login?include=user';
    return this.http.post(url, { email: eml, password: pswrd }, { headers: this.header })
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      });
  }

  register(user: UserModel): Observable<any> {
    const url = this.serverUrl + '/clients';
    this.header.delete('Authorization');
    return this.http.post(url, user, { headers: this.header })
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      });
  }

  logOut(): Observable<any> {
    const url = this.serverUrl + '/clients/logout?access_token=' + this.userAuth.getToken();
    console.info('debug url', url);
    const data = { access_token: this.userAuth.getToken() };
    return this.http.post(url, data, { headers: this.header })
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      });
  }

  getFriends(id: string): Observable<any> {
    const url = this.serverUrl + '/clients/friendList?id='+ 
    id + '&access_token=' + this.userAuth.getToken;
    
    return this.http.get(url, { headers: this.header })
      .map(res => res.json())
      .catch(err => {
        return Observable.throw(err);
      });
  }
 
}

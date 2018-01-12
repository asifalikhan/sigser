import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { LoggerService } from './logger.service';
import { ConfigService } from './config.service';
import {CookieService} from 'ng2-cookies';
import { BaLoadingSpinner } from '../theme/services';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { of } from 'rxjs/observable/of';
@Injectable()

export class HttpService {
  protected logger: any;
  protected config: any;
 // protected accessToken:any;

  public baseURL: string;
  constructor(public http: Http, private _loading: BaLoadingSpinner) {
    this.logger = new LoggerService();
    this.config = new ConfigService();
    //this.accessToken = sessionStorage.getItem("accessToken");
    //this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
  // this.baseURL = this.config.ip + ":" + this.config.port + this.config.baseRoute;
    this.baseURL = this.config.baseRoute;

  }


  getData(url: string): Observable<any> {
    this._loading.show();
    return this.http.get(this.baseURL + url)
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  search(term: string): Observable<any> {

    // let url = 'Profiles?filter[where][firstName][ilike]=%' + term + '%';
    const obj = {
      where: {
        firstName: {
          like: term,
        },
      },
    };
    // let url = "Profiles?filter={'where':{'firstName':{'like':' + term + '}}}";

   // let url = "Profiles?filter=" + JSON.stringify(obj);
    let url = "Profiles" + "?filter[where][or][0][firstName][like]="+term+
     "&filter[where][or][1][lastName][like]="+term;

    if (term === '') {
      return of([]);
    }
//+ "?access_token=" +this.accessToken
// "&?filter[where][and][0][firstName][like]="+term+
// "&filter[where][and][1][lastName][like]="+term+
    //  this._loading.show();
    return this.http.get(this.baseURL + url)
      .map(response => {
        this.logger.log(response);
        //        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        //        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  /*   getData(url: string): Promise<any> {
      this._loading.show();
      let respData: any;
      let resp: any;
      this.http.get(this.baseURL + url)
        .subscribe(
        response => {
          this.logger.log(response);
          resp = JSON.parse(JSON.stringify(response));
          respData = JSON.parse(resp._body);
        },
        error => this.logger.log(error.text())
        );
        
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this._loading.hide();
          resolve(respData);
        }, 2000);
      });
    } */

  getFile(url: string): Observable<any> {
    this._loading.show();
    return this.http.get(this.baseURL + url)
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  postData(url: string, values: Object): Observable<any> {

    this._loading.show();
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(this.baseURL + url, values, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  patchData(url: string, values: Object): Observable<any> {
    this._loading.show();
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.patch(this.baseURL + url, values, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  putData(url: string, values: Object): Observable<any> {
    this._loading.show();
    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.put(this.baseURL + url, values, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }
  uploadFile(containerName: string, event: any): Observable<any> {

    var file = event.srcElement.files[0];

    let data = new FormData();
    data.append("file", file);

    let url = 'containers/' + containerName + '/upload';
    return this.http.post(this.baseURL + url, data)
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }
  /*   uploadFile2(containerName: string, event: any): Promise<any> {
  
      this._loading.show();
      let respData: any;
  
      var file = event.srcElement.files[0];
  
      let data = new FormData();
      data.append("file", file);
  
      let url = 'containers/'+containerName+'/upload';
      this.http.post(this.baseURL + url, data)
  
        .subscribe(
  
        (response) => {
          this.logger.info(response);
          let resp = JSON.parse(JSON.stringify(response));
          respData = { 
            "response":true,
            "data": resp
            };
        },
        error => {
          this.logger.error(error);
          let resp = JSON.parse(error._body);
          respData = { 
            "response":false,
            "data": resp
            };
          alert(resp.error.message);
        }
        );
  
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this._loading.hide();
          resolve(respData);
        }, 2000);
      });
    } */

  deleteData(url: string): Observable<any> {

    this._loading.show();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let res: boolean;
    return this.http.delete(this.baseURL + url, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  deleteFile(url: string): Observable<any> {

    return this.http.delete(this.baseURL + url)
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }



  postUser(url: string, values: Object): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });

    let data = JSON.parse(JSON.stringify(values));
    data.password = data.passwords.password;
    delete data.passwords;

    return this.http.post(this.baseURL + url, data, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  login(url: string, values: Object): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(this.baseURL + url, values, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  resetPass(url: string, values: Object): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post(this.baseURL + url, values, { headers: headers })
      .map(response => {
        this.logger.log(response);
        this._loading.hide();
        return <any>response.json();
      }
      )
      .catch(error => {
        this.logger.log(error);
        this._loading.hide();
        return Observable.throw(<any>error);
      });
  }

  public getFields(arrayOfObject, field, except) {
    let output = [];
    for (var i = 0; i < arrayOfObject.length; ++i) {
      if (arrayOfObject[i][field] != except) {
        output.push(arrayOfObject[i][field]);
      }
    }

    return output;
  }

  public getField(arrayOfObject, field, match) {
    let output = [];
    for (var i = 0; i < arrayOfObject.length; ++i) {
      if (i == match) {
        output.push(arrayOfObject[i][field]);
      }
    }

    return output;
  }
}

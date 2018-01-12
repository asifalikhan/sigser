import {Injectable} from '@angular/core';
import {Headers, Http, Response,RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable}     from 'rxjs/Observable';
/* import {Tabvn} from "./tabvn";
import {FileObject} from "./file"; */
import {unescape} from "querystring";
//import {User} from "./user/user";


@Injectable()
export class FileService {
  private headers = new Headers({
    // 'Content-Type': 'application/json',
    //'Authorization': Tabvn.auth().getCurrentUserSession(),
  });

  private fileUrl = 'http://127.0.0.1:3000/api/Files';


  constructor(private http: Http) {

    this.updateHeaders();
  }

  updateHeaders() {
    

    let currentUser: any = sessionStorage.get('user');

    if (!currentUser) {
      this.headers.delete("Authorization");
    } else {

      let headers = new Headers({ 'Content-Type': 'application/json' });  
      let options = new RequestOptions({ headers: headers });
    }
  }

  delete(id): Observable<any> {


    this.updateHeaders();
    this.headers.set("Content-Type", "application/json");

    let url = this.fileUrl + '/' + id;
    return this.http.delete(url, {headers: this.headers}).map(res => res).catch(err=>{
      return Observable.throw(err);
    })

  }

  upload(file)/* : Observable<FileObject>  */{


    this.updateHeaders();

    let data = new FormData();
    data.append("file", file);

    return this.http.post(this.fileUrl + '/upload', data, {headers: this.headers}).map(res=> res.json()).catch(err => {
      return Observable.throw(err);
    });


  }


  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }


  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else

      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }

  validateFile(file): boolean {

/*     let fileAcceptTypes: string[] = Tabvn.config().get('fileUploadAcceptTypes');
    let fileSizeMaximum: number = Tabvn.config().get('fileUploadMaximumSize');


    let fileType = file.type;
    let fileSize = file.size;


    for (let ftype of fileAcceptTypes) {


      if (ftype === fileType && fileSize <= fileSizeMaximum) {

        return true;
      }
    } */

    return true;

  }

  getFileUrl(name): string {

    return this.fileUrl+'/download/' + name;
  }


}
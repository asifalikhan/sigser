import { Http } from '@angular/http';

export class HttpClientService {

    constructor( public http: Http) {

    }

    public get(url : string, data : object) {

   // return new Promise((resolve, reject) => {
      this.http.get(url)
        .subscribe(
          response => console.log( null, response.text() ),
          error => console.log(error.text() )
        );
   // });
  }

}
import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../../../theme/validators';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {CookieService} from 'ng2-cookies';

import { HttpService } from '../../../../services/http.service';
import { AlertService } from '../../../../services/alert.service';

import { Message } from 'primeng/primeng';
@Component({
  selector: 'info',
  templateUrl: './info.html',
  styleUrls: ['./info.scss'],
  providers: [CookieService,HttpService,AlertService]
})
export class Info {
  msgs: Message[] = [];
  constructor(protected _alert: AlertService,public cookiesService: CookieService,protected _HttpService: HttpService) {

    let cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
  }

 ngOnInit(){
 }

 upgrade(){
  this.msgs = this._alert.showError("Error","No Plan Avalilable yet")
 }
 
}

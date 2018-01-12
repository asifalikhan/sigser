
import {Component} from '@angular/core';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../../../../../theme/validators';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CookieService } from 'ng2-cookies';
import { NgUploaderOptions } from 'ngx-uploader';
import { LoggerService } from '../../../../../../services/logger.service';
import { HttpService } from '../../../../../../services/http.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { AlertService } from '../../../../../../services/alert.service';
import { Message } from 'primeng/primeng';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'changePassword',
  templateUrl: './changePassword.html',
  styleUrls: ['./changePassword.scss'],
  providers: [CookieService,LoggerService,AlertService,HttpService]
})
export class ChangePassword {

  msgs: Message[] = [];
  changePassURL:string;
  currentPasswordError:boolean = false;
  public changePassform:FormGroup;
  public oldPassword:AbstractControl;
  public newPassword:AbstractControl;
  public repeatPassword:AbstractControl;


  public passwords:FormGroup;
  
  public careerId:string;
  public cookies:any;

  showUpdateForm:boolean=false;

        
  constructor(private slimLoader: SlimLoadingBarService,protected _alert:AlertService,private logger:LoggerService,public cookiesService: CookieService,
    changePassfb:FormBuilder,generalInfofb:FormBuilder
  ,protected _HttpService: HttpService) {
       
     
    this.changePassform = changePassfb.group({
      'oldPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'passwords': generalInfofb.group({
        'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('newPassword', 'repeatPassword') })
    });

    this.oldPassword = this.changePassform.controls['oldPassword'];
    this.passwords = <FormGroup> this.changePassform.controls['passwords'];
    this.newPassword = this.passwords.controls['newPassword'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.changePassURL="Profiles/change-password?access_token="+this.cookies.accessToken;
  }

  public onChangePass(values:Object):void {
    this.currentPasswordError = false;
    if (this.changePassform.valid) {
      
      let value=JSON.parse(JSON.stringify(values));
      value.newPassword=value.passwords.newPassword;

       this._HttpService.postData(this.changePassURL,value).subscribe((data) =>{
          this.msgs=this._alert.showSuccess("Success","Password Change Successfully");
          this.changePassform.reset();
          
        },
        error =>{
          this.msgs=this._alert.showError("Error","Invalid Current Password");
          this.currentPasswordError = true;
          this.changePassform.reset();
        });
    }
  }

  public cancel()
  {
    this.changePassform.reset();
  }
  
}


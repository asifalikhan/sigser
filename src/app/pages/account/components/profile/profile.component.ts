import { Component , OnInit, Input, Output, EventEmitter, OnChanges, ViewChild} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../../../theme/validators';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CookieService } from 'ng2-cookies';
import { NgUploaderOptions } from 'ngx-uploader';
import { LoggerService } from '../../../../services/logger.service';
import { HttpService } from '../../../../services/http.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { AlertService } from '../../../../services/alert.service';
import { Message } from 'primeng/primeng';
import { LocalDataSource } from 'ng2-smart-table';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../../../pages.menu';
import { BaMenuService } from '../../../../theme';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  providers: [CookieService, LoggerService, AlertService, HttpService]
})
export class Profile {

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  date = new Date();
  num = 90;
  public files: any;
  msgs: Message[] = [];

  loading=true;
  getProfileURL: string;
  changePassURL: string;
  postURL: string;

  public generalInfoform: FormGroup;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public username: AbstractControl;
  public email: AbstractControl;
  public rolesId: AbstractControl;
  public roles: any;
  public groupsId: AbstractControl;
  public groups: any;


  public changePassform: FormGroup;
  public oldPassword: AbstractControl;
  public newPassword: AbstractControl;
  public repeatPassword: AbstractControl;

  public profile_pic:string;


  showUpdateForm: boolean = false;


  public careerId: string;
  public cookies: any;


  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile: any = {
    picture: 'assets/img/theme/no-photo.png'
  };
  public uploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  public fileUploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  LoadingBar: any;


  constructor(public http: Http, private _menuService: BaMenuService,
     public route: ActivatedRoute, public router: Router, private slimLoader: SlimLoadingBarService,
      protected _alert: AlertService, private logger: LoggerService, public cookiesService: CookieService
    , personalDetailsfb: FormBuilder, generalInfofb: FormBuilder, protected _HttpService: HttpService) {

    this.generalInfoform = generalInfofb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      /* 'rolesId': [{value: '',disabled: true}, Validators.compose([Validators.required])],
      'groupsId': [{value: '',disabled: true}, Validators.compose([Validators.required])], */
    });

    this.firstName = this.generalInfoform.controls['firstName'];
    this.lastName = this.generalInfoform.controls['lastName'];
    this.username = this.generalInfoform.controls['username'];
    this.email = this.generalInfoform.controls['email'];/* 
    this.rolesId = this.generalInfoform.controls['rolesId'];
    this.groupsId = this.generalInfoform.controls['groupsId']; */


    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.getProfileURL = "Profiles/" + this.cookies.userId + "?access_token=" + this.cookies.accessToken;

  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    
    /* let rolesUrl = 'Roles?filter[fields][id]=true&filter[fields][name]=true';
    this._HttpService.getData(rolesUrl).subscribe((data) => {
      this.roles = data;
    });
    let groupsUrl = 'Groups?filter[fields][id]=true&filter[fields][name]=true';
    this._HttpService.getData(groupsUrl).subscribe((data) => {
      this.groups = data;
    }); */

    this._HttpService.getData(this.getProfileURL).subscribe((data) => {
      this.profile_pic=data.profile_pic;
      if(this.profile_pic!=undefined){
        let picUrl=this._HttpService.baseURL+'containers/profile_pic/download/'+this.profile_pic;
        this.profile.picture=picUrl;
        sessionStorage.setItem('profilePic',picUrl);
      }
      
      this.generalInfoform.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,/* 
        rolesId: data.rolesId,
        groupsId: data.groupsId, */
      });
      this.loading=false
    });


    //// Alert code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);
    //// End

  }

  onChange(file) {
    let fileExtension = '.' + file.srcElement.files[0].name.split('.').pop();
    if(fileExtension == ".jpg" || fileExtension == ".png"){
      this._HttpService.uploadFile('profile_pic', file).subscribe((data) => {
        
          //let fileData = JSON.parse(data.data._body);
          let fileName = data.result.files.file[0].name;
          this._HttpService.patchData(this.getProfileURL, {"profile_pic":fileName}).subscribe();
          this.msgs = this._alert.showSuccess("Success", "Picture Saved");
        
      },(error)=>{
        this.msgs = this._alert.showError("Error", "Not Saved");
      });
    }
    else{
      this.msgs = this._alert.showError("Error", "this File can't be set as a profile Piucture");
    }
    
    
  }

  public onSubmit(values: Object): void {
    if (this.generalInfoform.valid) {
      this.logger.log(values);

      this._HttpService.patchData(this.getProfileURL, values).subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.msgs = this._alert.showSuccess("Success", "Changes Saved");
          this.ngOnInit();
          this.generalInfoform.reset();

        }
        else {
          this.msgs = this._alert.showError("Error", "Detail Not Saved");
        }

      });
    }
  }

  public cancel() {
    this.generalInfoform.reset();
    this.ngOnInit();
  }

}

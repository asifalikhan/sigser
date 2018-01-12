import { Component , OnInit, Input, Output, EventEmitter, OnChanges, ViewChild} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../../../../../pages.menu';
import { BaMenuService } from '../../../../../../theme';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'personalDetails',
  templateUrl: './personalDetails.html',
  styleUrls: ['./personalDetails.scss'],
  providers: [CookieService, LoggerService, AlertService, HttpService]
})
export class PersonalDetails {

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


  
  public personalDetailsForm: FormGroup;
  public country: AbstractControl;
  public dateOfBirth: AbstractControl;
  public gender: AbstractControl;
  public bloodGroup: AbstractControl;
  public bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  public religion: AbstractControl;
  public nationality: AbstractControl;
  public city: AbstractControl;
  public address: AbstractControl;
  public zipCode: AbstractControl;
  public mobile: AbstractControl;
  public additionalInfo: AbstractControl;

  public profile_pic:string;

  showUpdateForm: boolean = false;

  public cookies: any;


  LoadingBar: any;


  constructor(public http: Http, private _menuService: BaMenuService,
     public route: ActivatedRoute, public router: Router, private slimLoader: SlimLoadingBarService,
      protected _alert: AlertService, private logger: LoggerService, public cookiesService: CookieService
    , personalDetailsfb: FormBuilder, protected _HttpService: HttpService) {


    this.personalDetailsForm = personalDetailsfb.group({
      'dateOfBirth': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'gender': [''],
      'bloodGroup': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'religion': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'nationality': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'country': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'city': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'address': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'zipCode': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'additionalInfo': ['', Validators.compose([Validators.minLength(4)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],

    });

    this.dateOfBirth = this.personalDetailsForm.controls['dateOfBirth'];
    this.gender = this.personalDetailsForm.controls['gender'];
    this.bloodGroup = this.personalDetailsForm.controls['bloodGroup'];
    this.religion = this.personalDetailsForm.controls['religion'];
    this.nationality = this.personalDetailsForm.controls['nationality'];
    this.country = this.personalDetailsForm.controls['country'];
    this.city = this.personalDetailsForm.controls['city'];
    this.address = this.personalDetailsForm.controls['address'];
    this.zipCode = this.personalDetailsForm.controls['zipCode'];
    this.mobile = this.personalDetailsForm.controls['mobile'];
    this.additionalInfo = this.personalDetailsForm.controls['additionalInfo'];

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.getProfileURL = "Profiles/" + this.cookies.userId + "?access_token=" + this.cookies.accessToken;

  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

    this._HttpService.getData(this.getProfileURL).subscribe((data) => {
      
      if (data.dateOfBirth != null) {

        var dob = data.dateOfBirth.substr(0, 10);
        
        this.personalDetailsForm.setValue({
          dateOfBirth: dob,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          religion: data.religion,
          nationality: data.nationality,
          country: data.country,
          city: data.city,
          address: data.address,
          zipCode: data.zipCode,
          mobile: data.mobile,
          additionalInfo: data.additionalInfo
        });
      }
      this.loading=false
    });


    //// Alert code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);
    //// End

  }

  public onSaveDetails(values: Object): void {
    if (this.personalDetailsForm.valid) {
      this.logger.log(values);
      this._HttpService.patchData(this.getProfileURL, values).subscribe((data) => {
        if (data != null) {
          this.msgs = this._alert.showSuccess("Success", "Changes Saved");
          this.ngOnInit();
        }
        else {
          this.msgs = this._alert.showError("Error", "Not Saved");
        }
      });
    }
  }

  public cancel() {
    this.personalDetailsForm.reset();
    this.ngOnInit();
  }

}

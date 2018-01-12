import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpService } from '../../services/http.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { UtilityService } from '../../services/utility.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'newpassword',
  templateUrl: './newpassword.html',
  styleUrls: ['./newpassword.scss'],
  providers : [UtilityService]
})
export class Newpassword {


  private _success = new Subject<string>();
  private _error = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  errorMessage:string;
  loading:boolean=false;

  postProfileURL:string;

  public newPassForm:FormGroup;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;

  public submitted:boolean = false;
      
  constructor(public route:ActivatedRoute,private utility:UtilityService,private router:Router,registerFb:FormBuilder,protected _HttpService:HttpService) {

    this.newPassForm = registerFb.group({
      'passwords': registerFb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.passwords = <FormGroup> this.newPassForm.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    
    

    this.postProfileURL="Profiles";
     
  }

  public onSubmit(values:Object):void {
    let token=this.route.snapshot.params['id'];
    this.loading = true;
    var value= JSON.parse(JSON.stringify(values));
    let resetPasswordURL = "Profiles/reset-password?access_token="+token;
    let data = {
      "newPassword":value.passwords.password
    }
          this._HttpService.resetPass(resetPasswordURL,data)
            .subscribe((resp)=>{
                this._success.next('Password Changed Successfully');
                this.newPassForm.reset();
                this.submitted = true;
                this.loading = false;
            },
          (error) =>{
            this._error.next('Invalid Access Token');
            this.loading = false;
          });
 
  }

  
  ngOnInit(){

    //// Alert code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);
    //// End

    //// Error Alert Code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._error.subscribe((message) => this.errorMessage = message);
    debounceTime.call(this._error, 4000).subscribe(() => this.errorMessage = null);    
    // code End
  }
}

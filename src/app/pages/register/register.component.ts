import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpService } from '../../services/http.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { UtilityService } from '../../services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  providers : [UtilityService]
})
export class Register {


  private _success = new Subject<string>();
  private _error = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  errorMessage:string;

  postProfileURL:string;

  public registerForm:FormGroup;
  public firstName:AbstractControl;
  public lastName:AbstractControl;
  public username:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
/*   public rolesId:AbstractControl;
  public roles:any;
  public groupsId: AbstractControl;
  public groupName:any; */

  public submitted:boolean = false;
      
  constructor(private utility:UtilityService,private router:Router,registerFb:FormBuilder,protected _HttpService:HttpService) {

    this.registerForm = registerFb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': registerFb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.firstName = this.registerForm.controls['firstName'];
    this.lastName = this.registerForm.controls['lastName'];
    this.username = this.registerForm.controls['username'];
    this.email = this.registerForm.controls['email'];
    /* this.rolesId = this.registerForm.controls['rolesId'];
    this.groupsId = this.registerForm.controls['groupsId']; */
    this.passwords = <FormGroup> this.registerForm.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    
    

    this.postProfileURL="Profiles";
     
  }

/*   findGroupName(id){
    let roleName = this.roles.filter(function(item){
      return item.id == id;
    });
    this.groupName=roleName[0].name+"s";
  } */

  public onSubmit(values:Object):void {
    var value= JSON.parse(JSON.stringify(values));
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log(value);
      this._HttpService.postUser(this.postProfileURL,value)
      .subscribe(
        (resp)=>{
          this._success.next('verification email sent to your email');
          this.registerForm.reset();
          this.submitted = false;
        
      },
      error => {
        this._error.next('Username or Email already exists');
        this.submitted = false;
      });

    }
    /* let groupsUrl= 'Groups?filter[fields][id]=true&filter[where][name]=students';
    this._HttpService.getData(groupsUrl).subscribe((data) => {
        value.groupsId = this._HttpService.getFields(data, 'id',null);
        value.groupsId = value.groupsId[0];
        
    }); */
 
  }
  
  ngOnInit(){
    
    this.utility.isLoggedIn().then((result:boolean) =>{
      if(result){
        this.router.navigate(["/pages/dashboard"]);
      }
    });

    /* let rolesUrl= 'Roles?filter[fields][id]=true&filter[fields][name]=true';
    this._HttpService.getData(rolesUrl).subscribe((data) => {
        this.roles = data.filter(function(item){
          return item.name != 'admin';
        });
    }); */

/*     let batchesUrl= 'Batches?filter[fields][id]=true&filter[fields][batchCode]=true';
    this._HttpService.getData(batchesUrl).subscribe((data) => {
        this.batches = data;
    }); */

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


  onStep1Next(event){
    console.log(event);
  }
  onStep2Next(event){
    console.log(event);
  }
  onStep3Next(event){
    console.log(event);
  }
  isCompleted = false;
  onComplete(values){
    console.log(values);
    this.isCompleted = true;

    var value= JSON.parse(JSON.stringify(values));
    this.submitted = true;

    let groupsUrl= 'Groups?filter[fields][id]=true&filter[where][name]=students';
    this._HttpService.getData(groupsUrl).subscribe((data) => {
        value.groupsId = this._HttpService.getFields(data, 'id',null);
        value.groupsId = value.groupsId[0];
        if (this.registerForm.valid) {
          this._HttpService.postUser(this.postProfileURL,value)
          .subscribe(
            (resp)=>{
              this._success.next('verification email sent to your email');
              this.registerForm.reset();
              this.submitted = false;
            
          },
          error => {
            this._error.next('Username or Email already exists');
            this.submitted = false;
          });
    
        }
    });
 
  }
}

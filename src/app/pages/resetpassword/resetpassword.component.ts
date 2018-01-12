import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {CookieService} from 'ng2-cookies';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';

import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { UtilityService } from '../../services/utility.service';
@Component({
  selector: 'resetpassword',
  templateUrl: './resetpassword.html',
  styleUrls: ['./resetpassword.scss'],
  providers: [CookieService,LoggerService,UtilityService]
})
export class Resetpassword implements OnInit, OnDestroy {

  loading=false;

private _success = new Subject<string>();
   private _error = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
   errorMessage:string;

  sub: any;
  public form:FormGroup;
  public email:AbstractControl;
  public submitted:boolean = false;

  resetURL:string;

  constructor(private utility:UtilityService,protected logger:LoggerService,protected _HttpService: HttpService,public cookiesService:CookieService,fb:FormBuilder,private route: ActivatedRoute,
  private router: Router) {

      this.resetURL="Profiles/reset";

      this.form = fb.group({
        'email': ['', Validators.compose([Validators.required, EmailValidator.validate])]
      });

      this.email = this.form.controls['email'];
   
  }


  ngOnInit(){

    this.utility.isLoggedIn().then((result:boolean) =>{
      if(result){
        this.router.navigate(["/pages/dashboard"]);
      }
    });
        this.sub = this.route.params.subscribe(params => {
          let id = Number.parseInt(params['id']);
        });

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

  ngOnDestroy(){
        this.sub.unsubscribe();
  }


/*   public onSubmit(values:Object):void {
    
     this.submitted = true;
     if (this.form.valid) {
        this.loading = true;
        console.log(values);

        this._HttpService.login2(this.resetURL,values).then((data) => {
          this.loading=false;
          this.submitted = false;
          console.log(data);

            if(data==null){
              this._success.next('a link to reset password sent to your email');
            }
            else this._error.next('Email not found');
        });   
    }      
  } */

    public onSubmit(values:Object):void {
    
     this.submitted = true;
     if (this.form.valid) {
        this.loading = true;

        this._HttpService.login(this.resetURL,values).subscribe((data) => {
          this.loading=false;
          this.submitted = false;
          this._success.next('a link to reset password sent to your email');
        },(error)=>{
          this.loading=false;
          this.submitted = false;
          this._error.next('Email not found');
        });   
    }      
  }
}

import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {CookieService} from 'ng2-cookies';

import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { UtilityService } from '../../services/utility.service';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [CookieService,LoggerService,UtilityService]
})
export class Login implements OnInit, OnDestroy {

  loading=false;

private _success = new Subject<string>();
   private _error = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
   errorMessage:string;

  sub: any;
  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  loginURL:string;

  constructor(private utility:UtilityService,protected logger:LoggerService,protected _HttpService: HttpService,public cookiesService:CookieService,fb:FormBuilder,private route: ActivatedRoute,
  private router: Router) {

      this.loginURL="Profiles/login";

      this.form = fb.group({
        'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      });

      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];
  }


  ngOnInit(){

    this.utility.isLoggedIn().then((result:boolean) =>{
      if(result){
        this.router.navigate(["/pages/live_room"]);
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
        let value = JSON.parse(JSON.stringify(values));
        let email = value.email;

        this._HttpService.login(this.loginURL,values).then((data) => {

          console.log(data);
          this.loading=false;
            if(data!=null){
              if(data.userId!=null){
                sessionStorage.setItem("user",data.userId);
                sessionStorage.setItem("userType",data.userType);
                let code=[];
                
                data.services.filter(function(item){
                  code.push(item.services.code);
                });

                if(typeof (Storage) !== 'undefined'){
                  let i=0;
                  code.forEach(function(serviceCode){
                    i++;
                    sessionStorage.setItem("code"+i,serviceCode);
                  });
                }

                this.cookiesService.set("userId",data.userId);
                this.cookiesService.set("accessToken",data.id);
                this._HttpService.patchData("Profiles/"+data.userId+"?access_token="+data.id,{"status":true});
                this.router.navigate(['/pages/dashboard']);
                sessionStorage.setItem("email", email)
              }
              else{
                if(data=='login failed'){
                  this._error.next(`Invalid Email or Password`);
                  this.submitted = false;
                }
                else this._error.next(data);
              }
            }
            else this._error.next('No Responce From Server');
        });   
    }      
  } */

    public onSubmit(values:Object):void {
    
     this.submitted = true;
     if (this.form.valid) {

        this.loading = true;
        let value = JSON.parse(JSON.stringify(values));
        let email = value.email;
        let dt:any;
        this._HttpService.login(this.loginURL,values).subscribe((data) => {
          console.log(data);
          this.loading=false;

            sessionStorage.setItem("user",data.userId);
            //sessionStorage.setItem("userType",data.userType);
            /* let code=[];
            
            data.services.filter(function(item){
              code.push(item.services.code);
            }); */

            /* if(typeof (Storage) !== 'undefined'){
              let i=0;
              code.forEach(function(serviceCode){
                i++;
                sessionStorage.setItem("code"+i,serviceCode);
              });
            } */

            this.cookiesService.set("userId",data.userId);
            this.cookiesService.set("accessToken",data.id);
            sessionStorage.setItem("accessToken",data.id);
            console.log(data);



  //   this._HttpService.getData("Profiles/" + data.userId).subscribe((resp) => {
      
  //             sessionStorage.setItem("LogedInUser", JSON.stringify(resp));
              

  //             // if(resp.firstName === 'gohar') {
  //             //   localStorage.setItem('roomOwnerID', resp.id);
  //             // }
      
  //           }, err => {
  //             console.error(err);
  // });

            this._HttpService.patchData("Profiles/"+data.userId+"?access_token="+data.id,{"status":true});
            this.router.navigate(['/pages/live_room']);
            sessionStorage.setItem("email", email);
        },(error)=>{

          //console.log(JSON.parse(error._body).error.message);
          
          if(JSON.parse(error._body).error.message == "login failed"){
            this._error.next(`Invalid Email or Password`);
          }
          else{
            this._error.next(JSON.parse(error._body).error.message);
          }
          this.submitted = false;
          this.loading=false;
        }); 
          
    }      
  }
}

import {Component} from '@angular/core';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CookieService } from 'ng2-cookies';
import { NgUploaderOptions } from 'ngx-uploader';
import { LoggerService } from '../../services/logger.service';
import { HttpService } from '../../services/http.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { AlertService } from '../../services/alert.service';
import { Message } from 'primeng/primeng';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  providers: [CookieService,LoggerService,AlertService]
})
export class Profile {

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  msgs: Message[] = [];

  getProfileURL: string;
  changePassURL:string;
  postURL: string;
  getCareerUrl:string;

  public educationInfoform:FormGroup;
  public eduId : AbstractControl;
  public institute:AbstractControl;
  public degree:AbstractControl;
  public fieldofstudy:AbstractControl;
  public grade:AbstractControl;
  public activities:AbstractControl;
  public completationyear:AbstractControl;
  public showUpdateForm:boolean=false;

  public generalInfoform:FormGroup;
  public firstName:AbstractControl;
  public additionalInfo:AbstractControl;
  public lastName:AbstractControl;
  public username:AbstractControl;
  public email:AbstractControl;
  public rolesId:AbstractControl;
  public roles:any;
  public groupsId: AbstractControl;
  public groups:any;

  public country:AbstractControl;
  public password:AbstractControl;
  public passwords:FormGroup;
  public personalDetailsForm:FormGroup;
  public dateOfBirth:AbstractControl;
  public gender:AbstractControl;
  public bloodGroup:AbstractControl;
  public bloodGroups=[ 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  public religion:AbstractControl;
  public nationality:AbstractControl;
  public city:AbstractControl;
  public address:AbstractControl;
  public zipCode:AbstractControl;
  public mobile:AbstractControl;

  public changePassform:FormGroup;
  public oldPassword:AbstractControl;
  public newPassword:AbstractControl;
  public repeatPassword:AbstractControl;
  

  public experienceInfoform:FormGroup;
  public experience:AbstractControl;
  public title:AbstractControl;
  public companyinstitute:AbstractControl;
  public location:AbstractControl;
  public fromdate:AbstractControl;
  public todate:AbstractControl;
  public IsCurrentyWorking:AbstractControl;

  public skillInfoform:FormGroup;
  public skillname:AbstractControl;
  public skilllevel:AbstractControl;
  
  public careerId:string;
  public cookies:any;
  

  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile:any = {
    picture: 'assets/img/app/profile/faheem.jpg'
  };
  public uploaderOptions:NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  public fileUploaderOptions:NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  LoadingBar:any;

        
  constructor(private slimLoader: SlimLoadingBarService,protected _alert:AlertService,private logger:LoggerService,public cookiesService: CookieService,
    public educationInfofb: FormBuilder, skillinfofb:FormBuilder,experienceInfofb:FormBuilder,generalInfofb: FormBuilder,changePassfb: FormBuilder
  ,personalDetailsfb: FormBuilder,protected _HttpService: HttpService) {
       
     
    
     
    this.skillInfoform = skillinfofb.group({
      'skillname': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'skilllevel': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.skillname = this.skillInfoform.controls['skillname']; 
    this.skilllevel = this.skillInfoform.controls['skilllevel'];

      this.educationInfoform = educationInfofb.group({
        'id'  : [''],
        'institute': ['', Validators.compose([Validators.minLength(4)])],
        'degree': ['', Validators.compose([Validators.minLength(4)])],
        'fieldOfStudy': ['', Validators.compose([Validators.minLength(4)])],
        'grade': ['', Validators.compose([Validators.minLength(1)])],
        'cActivities': ['', Validators.compose([Validators.minLength(2)])],
        'completionYear': ['', Validators.compose([Validators.minLength(4)])]
    });
    this.eduId = this.educationInfoform.controls['id']; 
    this.institute = this.educationInfoform.controls['institute']; 
    this.degree = this.educationInfoform.controls['degree'];
    this.fieldofstudy = this.educationInfoform.controls['fieldOfStudy'];
    this.grade = this.educationInfoform.controls['grade'];
    this.activities = this.educationInfoform.controls['cActivities'];
    this.completationyear = this.educationInfoform.controls['completionYear'];

     
    this.experienceInfoform = experienceInfofb.group({
      'experience': ['', Validators.compose([Validators.minLength(4)])],
      'title': ['', Validators.compose([Validators.minLength(4)])],
      'companyinstitute': ['', Validators.compose([Validators.minLength(4)])],
      'location': ['', Validators.compose([Validators.minLength(4)])],
      'fromdate': ['', Validators.compose([Validators.minLength(2)])],
      'todate': ['', Validators.compose([Validators.minLength(2)])],
      'IsCurrentyWorking': [''],
    });
    this.experience = this.experienceInfoform.controls['experience']; 
    this.title = this.experienceInfoform.controls['title'];
    this.companyinstitute = this.experienceInfoform.controls['companyinstitute'];
    this.location = this.experienceInfoform.controls['location'];
    this.fromdate = this.experienceInfoform.controls['fromdate'];
    this.todate = this.experienceInfoform.controls['todate'];
    this.IsCurrentyWorking = this.experienceInfoform.controls['IsCurrentyWorking'];

    this.generalInfoform = generalInfofb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'rolesId': ['', Validators.compose([Validators.required])],
      'groupsId': ['', Validators.compose([Validators.required])],
    });

    this.firstName = this.generalInfoform.controls['firstName'];
    this.lastName = this.generalInfoform.controls['lastName'];
    this.username = this.generalInfoform.controls['username'];
    this.email = this.generalInfoform.controls['email'];
    this.rolesId = this.generalInfoform.controls['rolesId'];
    this.groupsId = this.generalInfoform.controls['groupsId'];

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
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(11),Validators.maxLength(11)])],
       
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

    this.getProfileURL = "Profiles/"+this.cookies.userId+"?access_token="+this.cookies.accessToken;
    this.changePassURL = "Profiles/change-password?access_token="+this.cookies.accessToken;
    
    this.getCareerUrl= 'Careers/findOne?filter[where][profilesId]='+this.cookies.userId;
  }

 ngOnInit(){

  let rolesUrl= 'Roles?filter[fields][id]=true&filter[fields][name]=true';
  this._HttpService.getData(rolesUrl).subscribe((data) => {
      this.roles = data;//this._HttpService.getFields(data, 'name',null);
  });
  let groupsUrl= 'Groups?filter[fields][id]=true&filter[fields][name]=true';
  this._HttpService.getData(groupsUrl).subscribe((data) => {
      this.groups = data;//this._HttpService.getFields(data, 'name',null);
  });

  let eduUrl = "Profiles/"+this.cookies.userId+"/educations"
        this._HttpService.getData(eduUrl).subscribe((data)=>{
          this.source.load(data);
          if(data.institute!=null){
            this.educationInfoform.setValue({
              institute: data.institute,
              degree: data.degree,
              fieldofstudy: data.fieldofstudy ,
              grade:data.grade ,
              activities: data.activities,
              completationyear:data.completationyear ,
              additionalinfo: data.additionalinfo
            });
          }
          
          if(data.experience!=null){
            this.experienceInfoform.setValue({
              experience : data.experience,
              title : data.title,
              companyinstitute : data.companyinstitute,
              location : data.location,
              fromdate : data.fromdate,
              todate : data.todate,
              IsCurrentyWorking : data.IsCurrentyWorking
            });
          }
          if(data.skillname!=null){
            this.skillInfoform.setValue({
              skillname : data.skillname,
              skilllevel : data.skilllevel
            });
          }
        });

        this.slimLoader.start();
        this._HttpService.getData(this.getProfileURL).subscribe((data) => {
        this.startProgressBar();
        this.generalInfoform.setValue({
          firstName      : data.firstName,
          lastName       : data.lastName,
          username       : data.username,
          email          : data.email,          
          rolesId        : data.rolesId,
          groupsId       : data.groupsId,
        });
        

        if(data.dateOfBirth!=null){

            var dob = data.dateOfBirth.substr(0, 10);
            this.personalDetailsForm.setValue({
              dateOfBirth  : dob,
              gender       : data.gender,
              bloodGroup   : data.bloodGroup,
              religion     : data.religion,
              nationality  : data.nationality,
              country      : data.country,
              city         : data.city,
              address      : data.address,
              zipCode      : data.zipCode,
              mobile       : data.mobile,
              additionalInfo       : data.additionalInfo
            });
        }

            this.slimLoader.complete();
      });


        //// Alert code
        setTimeout(() => this.staticAlertClosed = true, 20000);
        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);
        //// End

   }

    startProgressBar() {
      this.slimLoader.color = 'green';
      this.slimLoader.height = '4px';
      return this.slimLoader;
    }

    public onSubmit(values:Object):void {
      if (this.generalInfoform.valid) {
        this.logger.log(values);
        
        this._HttpService.patchData(this.getProfileURL,values).subscribe((data) => {
          console.log(data);
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Changes Saved");
            this.ngOnInit();
            this.generalInfoform.reset();

          }
          else{
            this.msgs=this._alert.showError("Error","Detail Not Saved");
          }

      });
      }
    }

  public onSaveDetails(values:Object):void {
    if (this.personalDetailsForm.valid) {
        this.logger.log(values);
       
        this._HttpService.patchData(this.getProfileURL,values).subscribe((data) =>{
          console.log(data);
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Changes Saved");
            this.ngOnInit();
            this.generalInfoform.reset();
  
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }
  }
  public onUpdateEdu(values : object):void {
    console.log("Update call");
    let value=JSON.parse(JSON.stringify(values));
    let postURL = 'Profiles/'+this.cookies.userId+"/educations/"+value.id;
    if (this.educationInfoform.valid) {
      console.log(postURL);
       this._HttpService.putData(postURL,values).subscribe((data) => {
         console.log(data);
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Education Updated");
            this.ngOnInit();
            this.educationInfoform.reset();
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }

  }

  public onSaveEdu(values : object):void {
    console.log("Save call");
    let value=JSON.parse(JSON.stringify(values));
    let postURL = 'Profiles/'+this.cookies.userId+"/educations";
    if (this.educationInfoform.valid) {
      console.log(postURL);
       this._HttpService.postData(postURL,values).subscribe((data) => {
         console.log(data);
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","New Education Saved");
            this.ngOnInit();
            this.educationInfoform.reset();
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }

  }

  
  public onSaveExp(values:object):void {
    let postURL='Careers/'+this.careerId+"?access_token="+this.cookies.accessToken;
    if (this.experienceInfoform.valid) {
      this._HttpService.patchData(postURL,values).subscribe((data) => {
        console.log(data);
         if(data!=null){
           this.msgs=this._alert.showSuccess("Success","Experiance Saved");
           this.ngOnInit();
           this.experienceInfoform.reset();
         }
         else{
           this.msgs=this._alert.showError("Error","Not Saved");
         }
       });
   }
    
      }

  public onSaveSkill(values:object):void{
    let postURL='Careers/'+this.careerId+"?access_token="+this.cookies.accessToken;
      if (this.skillInfoform.valid) {
          this._HttpService.patchData(postURL,values).subscribe((data) => {
            console.log(data);
             if(data!=null){
               this.msgs=this._alert.showSuccess("Success","Skill Saved");
               this.ngOnInit();
               this.skillInfoform.reset();
             }
             else{
               this.msgs=this._alert.showError("Error","Not Saved");
             }
          });
       }

      }


  public onChangePass(values:Object):void {
    if (this.changePassform.valid) {
      
      let value=JSON.parse(JSON.stringify(values));
      value.newPassword=value.passwords.newPassword;
      this.logger.log(value);

       this._HttpService.postData(this.changePassURL,value).subscribe((data) =>{
        console.log(data);
        if(data!=null){
          this.msgs=this._alert.showSuccess("Success","Password Change Successfully");
          this.ngOnInit();
          this.skillInfoform.reset();
        }
        else{
          this.msgs=this._alert.showError("Error","Password Not Change");
        }
      });
    }
  }

  public cancel()
  {
    this.generalInfoform.reset(); 
    this.personalDetailsForm.reset(); 
    this.changePassform.reset(); 
    this.educationInfoform.reset();
    this.experienceInfoform.reset();
    this.skillInfoform.reset();
    this.ngOnInit() ;
  }

  public backToTable(){
    this.showUpdateForm=false;
  }

  /*View Table*/
  query: string = '';
  
    // Table Settings
    settings = {
      hideSubHeader:true,
      actions: null,
      add: {
        addButtonContent: '<i class="ion-ios-plus-outline"></i>',
        createButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      columns: {
        degree: {
          title: 'Degree',
          type: 'string'
        },
        institute: {
          title: 'Institute',
          type: 'string'
        },
        grade: {
          title: 'Grade',
          type: 'string'
        },
        completionYear: {
          title: 'Completion Year',
          type: 'string'
        }
      }
    };
  
    source: LocalDataSource = new LocalDataSource();

    onEdit(event):void{
      this.showUpdateForm=true;

      this.educationInfoform.setValue({
        id: event.data.id,
        institute: event.data.institute,
        degree: event.data.degree,
        fieldOfStudy: event.data.fieldOfStudy ,
        grade:event.data.grade ,
        cActivities: event.data.cActivities,
        completionYear:event.data.completionYear
      });
    }
  
}

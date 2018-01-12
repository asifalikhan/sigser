
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
  selector: 'educations',
  templateUrl: './educations.html',
  styleUrls: ['./educations.scss'],
  providers: [CookieService,LoggerService,AlertService,HttpService]
})
export class Educations {

  msgs: Message[] = [];
  getEducationsURL: string;

  public educationInfoform:FormGroup;
  public institute:AbstractControl;
  public degree:AbstractControl;
  public fieldOfStudy:AbstractControl;
  public grade:AbstractControl;
  public cActivities:AbstractControl;
  public completionYear:AbstractControl;
  public showUpdateForm:boolean=false;

  public educationUpdateform:FormGroup;
  public id : AbstractControl;
  public institute1:AbstractControl;
  public degree1:AbstractControl;
  public fieldOfStudy1:AbstractControl;
  public grade1:AbstractControl;
  public cActivities1:AbstractControl;
  public completionYear1:AbstractControl;
  public showUpdateForm1:boolean=false;
  
  public careerId:string;
  public cookies:any;

  public grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D'];

        
  constructor(private slimLoader: SlimLoadingBarService,protected _alert:AlertService,private logger:LoggerService,public cookiesService: CookieService,
     educationinfofb:FormBuilder,educationUpdatefb:FormBuilder
  ,protected _HttpService: HttpService) {

    this.educationInfoform = educationinfofb.group({
      'institute': ['', Validators.compose([Validators.minLength(4)])],
      'degree': ['', Validators.compose([Validators.minLength(4)])],
      'fieldOfStudy': ['', Validators.compose([Validators.minLength(4)])],
      'grade': ['', Validators.compose([Validators.minLength(1)])],
      'cActivities': ['', Validators.compose([Validators.minLength(2)])],
      'completionYear': ['', Validators.compose([Validators.minLength(4)])]
    });
    this.institute = this.educationInfoform.controls['institute']; 
    this.degree = this.educationInfoform.controls['degree'];
    this.fieldOfStudy = this.educationInfoform.controls['fieldOfStudy'];
    this.grade = this.educationInfoform.controls['grade'];
    this.cActivities = this.educationInfoform.controls['cActivities'];
    this.completionYear = this.educationInfoform.controls['completionYear']; 

    this.educationUpdateform = educationUpdatefb.group({
      'id'  : [''],
      'institute': ['', Validators.compose([Validators.minLength(4)])],
      'degree': ['', Validators.compose([Validators.minLength(4)])],
      'fieldOfStudy': ['', Validators.compose([Validators.minLength(4)])],
      'grade': ['', Validators.compose([Validators.minLength(1)])],
      'cActivities': ['', Validators.compose([Validators.minLength(2)])],
      'completionYear': ['', Validators.compose([Validators.minLength(4)])]
    });
    this.id = this.educationUpdateform.controls['id']; 
    this.institute1 = this.educationUpdateform.controls['institute']; 
    this.degree1 = this.educationUpdateform.controls['degree'];
    this.fieldOfStudy1 = this.educationUpdateform.controls['fieldOfStudy'];
    this.grade1 = this.educationUpdateform.controls['grade'];
    this.cActivities1 = this.educationUpdateform.controls['cActivities'];
    this.completionYear1 = this.educationUpdateform.controls['completionYear']; 

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.getEducationsURL = "Profiles/"+this.cookies.userId+"?access_token="+this.cookies.accessToken;
    }

  ngOnInit(){

    let educationUrl = "Profiles/"+this.cookies.userId+"/educations"

        this._HttpService.getData(educationUrl).subscribe((data)=>{
          this.source.load(data);
          if(data.institute!=null){
            this.educationInfoform.setValue({
              institute: data.institute,
              degree: data.degree,
              fieldOfStudy: data.fieldOfStudy ,
              grade:data.grade ,
              cActivities: data.cActivities,
              completionYear:data.completionYear 
            });
          }
        });

  }

  public onUpdateEdu(values : object):void {
    let value=JSON.parse(JSON.stringify(values));
    let postURL = 'Profiles/'+this.cookies.userId+"/educations/"+value.id;
    if (this.educationUpdateform.valid) {
       this._HttpService.putData(postURL,values).subscribe((data) => {
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Education Updated");
            this.ngOnInit();
            this.educationUpdateform.reset();
            this.backToTable();
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }

  }

  public onSaveEdu(values : object):void {
    let value=JSON.parse(JSON.stringify(values));
    let postURL = 'Profiles/' + this.cookies.userId + '/educations';
    if (this.educationInfoform.valid) {
       this._HttpService.postData(postURL,values).subscribe((data) => {
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","New education Saved");
            this.ngOnInit();
            this.educationInfoform.reset();
            $("#myModal").modal("hide");
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }

  }

  public cancel()
  {
    this.educationInfoform.reset();
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
      actions: {
        position: 'right',
        edit: false
      },
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

      console.log(event);
      this.educationUpdateform.setValue({
        id: event.data.id,
        institute: event.data.institute,
        degree: event.data.degree,
        fieldOfStudy: event.data.fieldOfStudy ,
        grade: event.data.grade ,
        cActivities: event.data.cActivities,
        completionYear: event.data.completionYear
      });
    }

    onDeleteConfirm(event): void {
      let value=JSON.parse(JSON.stringify(event.data));

        let deleteUrl = 'Educations/'+value.id;
        this._HttpService.deleteData(deleteUrl).subscribe((done) => {
          
            this.msgs=this._alert.showSuccess("Success","Education Deleted");
          
        },error => {
          this.msgs = this._alert.showError("Error", "Not Deleted");
        });

        event.confirm.resolve();
  
    }
  
}


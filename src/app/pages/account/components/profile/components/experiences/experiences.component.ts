
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
  selector: 'experiences',
  templateUrl: './experiences.html',
  styleUrls: ['./experiences.scss'],
  providers: [CookieService,LoggerService,AlertService,HttpService]
})
export class Experiences {

  msgs: Message[] = [];
  currentlyWorkingCheck:boolean=false;
  getExperiencesURL: string;

  public experienceInfoform:FormGroup;
  public designation:AbstractControl;
  public company:AbstractControl;
  public address:AbstractControl;
  public fromDate:AbstractControl;
  public toDate:AbstractControl;
  public currentlyWorking:AbstractControl;
  public showUpdateForm:boolean=false;

  public experienceUpdateform:FormGroup;
  public id:AbstractControl;
  public designation1:AbstractControl;
  public company1:AbstractControl;
  public address1:AbstractControl;
  public fromDate1:AbstractControl;
  public toDate1:AbstractControl;
  public currentlyWorking1:AbstractControl;
  
  public cookies:any;

        
  constructor(private slimLoader: SlimLoadingBarService,protected _alert:AlertService,private logger:LoggerService,public cookiesService: CookieService,
    experienceInfofb:FormBuilder,experienceUpdatefb:FormBuilder
  ,protected _HttpService: HttpService) {

    this.experienceInfoform = experienceInfofb.group({
      'designation': ['', Validators.compose([Validators.minLength(3)])],
      'company': ['', Validators.compose([Validators.minLength(3)])],
      'address': ['', Validators.compose([Validators.minLength(3)])],
      'fromDate': ['', Validators.compose([Validators.minLength(2)])],
      'toDate': [''],
      'currentlyWorking': [''],
    });
    this.designation = this.experienceInfoform.controls['designation']; 
    this.company = this.experienceInfoform.controls['company'];
    this.address = this.experienceInfoform.controls['address'];
    this.fromDate = this.experienceInfoform.controls['fromDate'];
    this.toDate = this.experienceInfoform.controls['toDate'];
    this.currentlyWorking = this.experienceInfoform.controls['currentlyWorking'];

    this.experienceUpdateform = experienceUpdatefb.group({
      'id': [''],
      'designation': ['', Validators.compose([Validators.minLength(3)])],
      'company': ['', Validators.compose([Validators.minLength(3)])],
      'address': ['', Validators.compose([Validators.minLength(3)])],
      'fromDate': ['', Validators.compose([Validators.minLength(2)])],
      'toDate': ['', Validators.compose([Validators.minLength(2)])],
      'currentlyWorking': [''],
    });
    this.id = this.experienceUpdateform.controls['id']; 
    this.designation1 = this.experienceUpdateform.controls['designation']; 
    this.company1 = this.experienceUpdateform.controls['company'];
    this.address1 = this.experienceUpdateform.controls['address'];
    this.fromDate1 = this.experienceUpdateform.controls['fromDate'];
    this.toDate1 = this.experienceUpdateform.controls['toDate'];
    this.currentlyWorking1 = this.experienceUpdateform.controls['currentlyWorking'];

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
}

  ngOnInit(){

    var experienceUrl = "Profiles/"+this.cookies.userId+"/experiances"
        this._HttpService.getData(experienceUrl).subscribe((data)=>{
          
          data.forEach((exp)=>{
            exp.fromDate = exp.fromDate.substr(0,10);
            if(!exp.currentlyWorking){
              exp.toDate = exp.toDate.substr(0,10);
            }
            //exp.toDate.substr(0,10);
          })
          this.source.load(data);
        });

  }

  hideToDate(){
    this.currentlyWorkingCheck=!this.currentlyWorkingCheck;
  }

  public onUpdateExp(values : object):void {
    let value=JSON.parse(JSON.stringify(values));
    if(value.currentlyWorking==true){
      value.toDate=null;
    }
    var postURL = 'Profiles/'+this.cookies.userId+"/experiances/"+value.id;
    if (this.experienceUpdateform.valid) {
       this._HttpService.putData(postURL,value).subscribe((data) => {
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Experience Updated");
            this.ngOnInit();
            this.experienceUpdateform.reset();
            this.backToTable();
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }

  }

  public onSaveExp(values : object):void {
    let value=JSON.parse(JSON.stringify(values));
    if(value.currentlyWorking==true){
      value.toDate=null;
    }
    let postURL = 'Profiles/'+this.cookies.userId+"/experiances";
    if (this.experienceInfoform.valid) {
       this._HttpService.postData(postURL,value).subscribe((data) => {
            this.msgs=this._alert.showSuccess("Success","New Experience Saved");
            this.ngOnInit();
            this.experienceInfoform.reset();
            
            $("#myModal").modal("hide");
        },
        (error) =>{
          this.msgs = this._alert.showError("Error","Not Saved");
        });
    }

  }

  public cancel()
  {
    this.experienceInfoform.reset();
    this.ngOnInit() ;
  }

  public backToTable(){
    this.showUpdateForm=false;
    this.currentlyWorkingCheck=false;
  }

  /*View Table*/
  query: string = '';
  
    // Table Settings
    settings = {
      hideSubHeader:true,
      actions:{
        position:'right',
        edit: false,
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
        designation: {
          title: 'Designation',
          type: 'string'
        },
        company: {
          title: 'Company',
          type: 'string'
        },
        address: {
          title: 'Address',
          type: 'string'
        },
        fromDate: {
          title: 'From Date',
          type: 'string'
        },
        toDate: {
          title: 'To Date',
          type: 'string'
        },
        currentlyWorking: {
          title: 'Currently Working?',
          type: 'string'
        }
      }
    };
  
    source: LocalDataSource = new LocalDataSource();

    onEdit(event):void{
      this.showUpdateForm=true;
      if(event.data.currentlyWorking){
        this.currentlyWorkingCheck=true;
      }
      else{
        this.currentlyWorkingCheck=false;
      }

      var fromDate = event.data.fromDate.substr(0, 10);
      if(event.data.currentlyWorking){
        var toDate = null;
      }
      else{
        var toDate = event.data.toDate.substr(0, 10);
      }
      
      this.experienceUpdateform.setValue({
        id        :   event.data.id,
        designation : event.data.designation,
        company : event.data.company,
        address : event.data.address,
        fromDate : fromDate,
        toDate : toDate,
        currentlyWorking : event.data.currentlyWorking
      });
    }

    onDeleteConfirm(event): void {
      let value=JSON.parse(JSON.stringify(event.data));
  

        let deleteUrl = 'Experiences/'+value.id;
        this._HttpService.deleteData(deleteUrl).subscribe((done) => {
            this.msgs=this._alert.showSuccess("Success","Experience Deleted");
        },error => {
          this.msgs = this._alert.showError("Error", "Not Deleted");
        });

        event.confirm.resolve();
  
    }
  
}

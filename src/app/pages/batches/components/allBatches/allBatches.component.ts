
import { Router } from '@angular/router'
import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import {CookieService} from 'ng2-cookies';

import { HttpService } from '../../../../services/http.service';
import { AlertService } from '../../../../services/alert.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Message} from 'primeng/primeng';


@Component({
  selector: 'allBatches',
  templateUrl: './allBatches.html',
  styleUrls: ['./allBatches.scss'],
  providers:[CookieService,AlertService,HttpService]
})
export class AllBatches {
  url :string;
  postURL: string;
  batchesURL: string;
  cookies:any;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  msgs: Message[] = [];
 
  public form:FormGroup;
  public updateForm:FormGroup;
  public id:AbstractControl;
  public name:AbstractControl;
  public batchCode:AbstractControl;
  public startDate:AbstractControl;
  public endDate:AbstractControl;
  public name2:AbstractControl;
  public batchCode2:AbstractControl;
  public startDate2:AbstractControl;
  public endDate2:AbstractControl;

  courseURL: string;

  viewData:boolean=false;
  viewData1:boolean=false;


  constructor(public router:Router,protected _alert:AlertService,public cookiesService:CookieService,fb:FormBuilder,updatefb:FormBuilder,protected _HttpService: HttpService)
  {
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.url = 'Batches/'+this.cookies.userId+'?access_token='+this.cookies.accessToken;
    this.postURL='Batches';
    this.batchesURL= 'Batches?access_token='+this.cookies.accessToken;
    this.courseURL= 'Courses?access_token='+this.cookies.accessToken;

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'batchCode': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'startDate': [''],
      'endDate': ['']
    });

    this.updateForm = updatefb.group({
      'id': [''],
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'batchCode': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'startDate': [''],
      'endDate': ['']
    });

    this.name = this.form.controls['name'];
    this.batchCode = this.form.controls['batchCode'];
    this.startDate = this.form.controls['startDate'];
    this.endDate = this.form.controls['endDate'];

    this.id = this.updateForm.controls['id'];
    this.name2 = this.updateForm.controls['name'];
    this.batchCode2 = this.updateForm.controls['batchCode'];
    this.startDate2 = this.updateForm.controls['startDate'];
    this.endDate2 = this.updateForm.controls['endDate'];

  }

 public onSaveBatch(values:Object):void {
    console.log(values);
        this._HttpService.postData(this.postURL,values).subscribe((data) => {
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","new Batch saved");
            this.form.reset();
            this.ngOnInit();
            $("#myModal").modal("hide");
          }
          else{
            this.msgs=this._alert.showError("Error","Batch not saved");
          }
        });
    
  }

   public onUpdateBatch(values:Object):void {
    let value = JSON.parse(JSON.stringify(values));
    
      let updateUrl = "Batches/"+value.id+"?access_token="+this.cookies.accessToken;
      this._HttpService.patchData(updateUrl,value).subscribe((data) => {
          if(data){
            this.msgs=this._alert.showSuccess("Success","Batch updated");
            this.updateForm.reset();
            this.ngOnInit();
          }
          else{
            this.msgs=this._alert.showError("Error","Batch not saved");
          }
        });
    
  }
  
  /*View Table*/
   query: string = '';

  settings = {
    hideSubHeader: true,
    actions:{
      position: 'right',
      delete: false,
    },
    mode:'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      edit: true
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    action:{
      visible:false
    },
    columns: {
      name: {
        title: 'Batch Name',
        type: 'string'
        
      },
      batchCode: {
        title: 'Batch Code',
        type: 'string'
      },
      startDate: {
        title: 'Start Date',
        type: 'date'
      },
      endDate: {
        title: 'End Date',
        type: 'date'
      }
    }

  };
 
    
    
    
//view Table 2 courses
 /*View Table*/
/*  query: string = '';*/
 
   settings1 = {
    hideSubHeader:true,
    actions: {
      position: 'right' 
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
       edit: true,
       mode:external
     },
     delete: {
       deleteButtonContent: '<i class="ion-trash-a"></i>',
       confirmDelete: true
     },
    /*  action:{
       visible:false
     }, */
     columns: {
      title: {
         title: 'Course Name',
         type: 'string'
         
       },
       description: {
         title: 'Course Description',
         type: 'string'
       }
     /*   startDate: {
         title: 'Start Date',
         type: 'date'
       },
       endDate: {
         title: 'End Date',
         type: 'date'
       } */
     } 
   }; 
 
  source1: LocalDataSource = new LocalDataSource();
  source: LocalDataSource = new LocalDataSource();

  ngOnInit(){
    this._HttpService.getData(this.courseURL).subscribe((data) => {
      this.source1.load(data);
    });
        
    this._HttpService.getData(this.batchesURL).subscribe((data) => {
      this.source.load(data);
    });

    //// Alert code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);

    //// End
  }

  onEdit(event):void{
    this.router.navigate(["/pages/batches/edit",event.data.id]);
/*     var start = event.data.startDate.substr(0, 10);
    var end = event.data.endDate.substr(0, 10);
    this.updateForm.setValue({
        name      : event.data.name,
        batchCode : event.data.batchCode,
        startDate : start,
        endDate   : end,
        id        : event.data.id
      }); */
  }

}

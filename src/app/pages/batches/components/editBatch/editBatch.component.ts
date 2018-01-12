
import { Router ,ActivatedRoute} from '@angular/router'
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
  selector: 'editBatch',
  templateUrl: './editBatch.html',
  styleUrls: ['./editBatch.scss'],
  providers:[CookieService,AlertService,HttpService]
})
export class EditBatch {
  
  cookies:any;
  msgs: Message[] = [];
 
  public form:FormGroup;
  public updateForm:FormGroup;
  public id:AbstractControl;
  public name:AbstractControl;
  public batchCode:AbstractControl;
  public startDate:AbstractControl;
  public endDate:AbstractControl;

  courseURL: string;


  constructor(public router:Router,public route:ActivatedRoute,protected _alert:AlertService,public cookiesService:CookieService,fb:FormBuilder,updatefb:FormBuilder,protected _HttpService: HttpService)
  {
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.updateForm = updatefb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'batchCode': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'startDate': [''],
      'endDate': ['']
    });

    this.name = this.updateForm.controls['name'];
    this.batchCode = this.updateForm.controls['batchCode'];
    this.startDate = this.updateForm.controls['startDate'];
    this.endDate = this.updateForm.controls['endDate'];

  }

   public onUpdateBatch(values:Object):void {
    let value = JSON.parse(JSON.stringify(values));
    
      let updateUrl = "Batches/"+value.id+"?access_token="+this.cookies.accessToken;
      this._HttpService.patchData(updateUrl,value).subscribe((data) => {
          if(data){
            this.msgs=this._alert.showSuccess("Success","Batch updated");
            this.updateForm.reset();
            this.ngOnInit();
            this.backToTable();
          }
          else{
            this.msgs=this._alert.showError("Error","Batch not saved");
          }
        });
    
  }
  
 /*View Table*/
 query: string = '';
 
   settings = {
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
     columns: {
      title: {
         title: 'Course Name',
         type: 'string'
         
       },
       description: {
         title: 'Course Description',
         type: 'string'
       }
     } 
   }; 
 
  source: LocalDataSource = new LocalDataSource();

  ngOnInit(){
    let id=this.route.snapshot.params['id'];

    let batchesURL="Batches/"+id;
        
    this._HttpService.getData(batchesURL).subscribe((data) => {
      var start = data.startDate.substr(0, 10);
      var end = data.endDate.substr(0, 10);
      this.updateForm.setValue({
          name      : data.name,
          batchCode : data.batchCode,
          startDate : start,
          endDate   : end
        });
    });

    let courseURL="Courses?filter[where][batchesId]="+id;
    this._HttpService.getData(courseURL).subscribe((data) => {
      this.source.load(data);
    });

  }

  deleteBatch(): void {
    let id=this.route.snapshot.params['id'];
      let deleteUrl = 'Batches/'+id;
      this._HttpService.deleteData(deleteUrl).subscribe((done) => {
        
          this.updateForm.reset();
          this.msgs=this._alert.showSuccess("Success","Batch deleted Successfully");
        
      },error => {
        this.msgs = this._alert.showError("Error", "Not Deleted");
      });
  }


  backToTable(){
    this.router.navigate(['pages/batches']);
  }

  onEdit(event){
    this.router.navigate(["/pages/manage_courses/view_course/",event.data.id]);
  }
}

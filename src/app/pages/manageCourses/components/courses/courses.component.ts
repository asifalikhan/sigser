import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import {CookieService} from 'ng2-cookies';

import { HttpService } from '../../../../services/http.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { AlertService } from '../../../../services/alert.service';
import {Message} from 'primeng/primeng';

import { Router } from '@angular/router';

@Component({
  selector: 'courses',
  templateUrl: './courses.html',
  styleUrls: ['./courses.scss'],
  providers:[CookieService,AlertService,HttpService]
})
export class Courses {
  url :string;
  postURL: string;
  courseURL: string;
  canManage=false;
  page=1;
  msgs: Message[] = [];

  cookies:any;
  public instructorNames: any;
  public batchesNames : any;
 
  public form:FormGroup;
  public title:AbstractControl;
  public description:AbstractControl;
  public purpose:AbstractControl;
  public audience:AbstractControl;
  public requirements:AbstractControl;
  public instructorsId: AbstractControl;
  public batchesId:AbstractControl;
  public creatorsId:AbstractControl;
  public submitted:boolean = false;

  purposes=[];
  audiences=[];
  requirementss=[];
  validCheck:boolean;

  public creatorId:any;
  public userType:string;
  public canAssignInstructor:boolean = false;

        
  constructor(public router:Router,protected _alert:AlertService,updatefb:FormBuilder,public cookiesService:CookieService,fb:FormBuilder,protected _HttpService: HttpService)
  {
    
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.creatorId = this.cookies.userId;
    this.userType = sessionStorage.getItem('userType');

    this.url = 'Profiles/'+this.cookies.userId+'?access_token='+this.cookies.accessToken;
    this.postURL='Courses';
    this.courseURL= 'Courses?access_token='+this.cookies.accessToken;

    this.form = fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'description': ['', Validators.compose([Validators.required, Validators.minLength(4)])] ,
      'purpose': ['', Validators.compose([Validators.minLength(4)])],
      'audience': ['', Validators.compose([Validators.minLength(4)])],
      'requirements': ['', Validators.compose([Validators.minLength(4)])],
      'instructorsId': [''],
      'batchesId': [''],
      'creatorsId': [''],
    });

    this.title = this.form.controls['title'];
    this.description = this.form.controls['description'];
    this.purpose = this.form.controls['purpose'];
    this.audience = this.form.controls['audience'];
    this.requirements = this.form.controls['requirements'];
    this.instructorsId = this.form.controls['instructorsId'];
    this.batchesId = this.form.controls['batchesId'];
    this.creatorsId = this.form.controls['creatorsId'];

    
  }

 public onSaveCourse(values:Object):void {
    this.submitted = true;
    console.log(values);
    let value = JSON.parse(JSON.stringify(values));
    value.purpose = this.purposes;
    value.audience = this.audiences;
    value.requirements = this.requirementss;
    if(this.userType != 'admin'){
      value.instructorsId = this.creatorId;
    }
    value.creatorsId = this.creatorId;

    if (this.form.valid) {
       this._HttpService.postData(this.postURL,value).subscribe((data) => {
         console.log(data);
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Course Saved Successfully");
            this.ngOnInit();
            this.form.reset();
            $("#myModal").modal("hide");
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }
  }
  
  /*View Table*/
  query: string = '';

  settings = {
    hideSubHeader:true,
    actions: {
      position: 'right',
      delete : false,
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
      mode:'external'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true,
    },
    columns: {
      title: {
        title: 'Title',
        type: 'string'
      },
      description: {
        title: 'Description',
        type: 'string'
      }/* ,
      Actions:
      {
        title:'Actions',
        type:'html',
        valuePrepareFunction:(cell,row)=>{
          return `<a title="See Detail" href="/#/pages/manage_courses/view_course/${row.id}">
                  </a><button>View</button>`
        },
        filter:false       
      } */
    }
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit(){
    this.validCheck=false;
/*     var ServicesCode=[];
    for(var i=1;i<=sessionStorage.length;i++){
      ServicesCode.push(sessionStorage.getItem("code"+i));
    }
    let canManage=false;
    ServicesCode.forEach(function(val){
      if(val=="1006"){
        canManage = true;
      }
    }); 
    this.canManage=canManage;
*/
    if(this.userType =='admin'){
      this.canAssignInstructor = true;
    }
    else{
      this.settings.actions=null;
    }

/*     if(this.userType =='instructor'){
      this.instructorsId = this.creatorId;
    } */

    this.purposes=[];
    this.audiences=[];
    this.requirementss=[];
        this._HttpService.getData(this.courseURL).subscribe((data) => {
          this.source.load(data);
        });

        let groupsURL = 'Groups?filter[fields][id]=true&filter[where][name]=instructors';    
        this._HttpService.getData(groupsURL).subscribe((data) => {
          let groupId = this._HttpService.getFields(data, 'id',null);
          const instructorURL= 'Profiles?filter[fields][id]=true&filter[fields][firstName]=true&filter[fields][lastName]=true&filter[where][groupsId]='+groupId;    
          this._HttpService.getData(instructorURL).subscribe((data) => {
            this.instructorNames = data.filter(function(instructor){
              return instructor.firstName != 'instructor';
            });
          });
        });

        let batchesUrl = 'Batches?filter[fields][name]=true&filter[fields][id]=true';
        this._HttpService.getData(batchesUrl).subscribe((data) => {
          this.batchesNames = data;//this._HttpService.getFields(data, 'firstName',null);
          console.log(this.batchesNames);
    
        });
  }

  onEdit(event):void{
    this.router.navigate(["/pages/manage_courses/view_course/",event.data.id]);
  }

  edit(event){
    this.router.navigate(["/pages/manage_courses/edit_course/",event.data.id]);
  }

  nextPage(){
    if(this.title.valid && this.description.valid){
      this.page++;
    }
    else{
      this.validCheck=true;
    }
    
  }

  previousPage(){
    this.page--;
  }

  newPurpose(){
    this.purposes.push(this.purpose.value);
    console.log(this.purposes);
  }

  newAudience(){
    this.audiences.push(this.audience.value);
    console.log(this.audiences);
  }
  newRequirement(){
    this.requirementss.push(this.requirements.value);
    console.log(this.requirements);
  }

  deletePurpose(purpose) {
    const index = this.purposes.indexOf(purpose);
    this.purposes.splice(index, 1);
    console.log(this.purposes);
  }

  deleteRequirement(requirement) {
    const index = this.requirementss.indexOf(requirement);
    this.requirementss.splice(index, 1);
    console.log(this.requirementss);
  }

  deleteAudience(audience) {
    const index = this.audiences.indexOf(audience);
    this.audiences.splice(index, 1);
    console.log(this.audiences);
  }

}

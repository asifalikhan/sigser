import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import {CookieService} from 'ng2-cookies';

import { HttpService } from '../../services/http.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { AlertService } from '../../services/alert.service';
import {Message} from 'primeng/primeng';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

import { NgUploaderOptions } from 'ngx-uploader';
@Component({
  selector: 'assignment',
  templateUrl: './assignment.html',
  styleUrls: ['./assignment.scss'],
  providers:[CookieService,AlertService]
})
export class Assignment {
  url :string;
  postURL: string;
  assignmentURL: string;
  canManage=false;
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  showSubmitForm = false;
  msgs: Message[] = [];
  public fileUploaderOptions:NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };
  downloadAssignmentUrl=this._HttpService.baseURL+'containers/assignments/download';
  showViewForm= false;
 
  public form:FormGroup;
  public assignmentTitle:AbstractControl;
  public coursesId:AbstractControl;
  public courses:any;
  public marks:AbstractControl;
  public teachersId:AbstractControl; 
  public descreption:AbstractControl;
  public dueDate:AbstractControl;
  public submitted:boolean = false;
  public teacherNames:any;
  private cookies:any;
  

  constructor(private _menuService: BaMenuService,protected _alert:AlertService,public cookiesService:CookieService,fb:FormBuilder,protected _HttpService: HttpService)
  {
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.url = 'assignments/'+this.cookies.userId+'?access_token='+this.cookies.accessToken;
    this.postURL='assignments';
    this.assignmentURL= 'assignments?access_token='+this.cookies.accessToken;

    this.form = fb.group({
      'dueDate': ['', Validators.compose([Validators.required])],
      'assignmentTitle': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'coursesId': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'teachersId': [''],
      'marks': [''],
      'descreption': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.dueDate = this.form.controls['dueDate'];
    this.assignmentTitle = this.form.controls['assignmentTitle'];
    this.coursesId = this.form.controls['coursesId'];
    this.teachersId = this.form.controls['teachersId'];
    this.descreption = this.form.controls['descreption'];
    this.marks = this.form.controls['marks'];
  }

 public onSaveassignment(values:Object):void {
    this.submitted = true;
    let value = JSON.parse(JSON.stringify(values));
    value.teachersId = this.cookies.userId;
    value.file = this.fileName;/* 
    console.log(value.teachersId); */
    if (this.form.valid) {
      this._HttpService.postData(this.postURL,value).subscribe((data) => {
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Assignment Saved Successfully");
            this.form.reset();
            this.ngOnInit();
          }
      });

    }
}
  
  /*View Table*/
   query: string = '';

  settings = {
    actions:{
      position : 'right',
      edit:true,
      delete:false
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
    },
    hideSubHeader:true,
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      assignmentTitle: {
        title: 'Title',
        type: 'string'
      },
      dueDate: {
        title: 'Due Date',
        type: 'string'
      },
      marks: {
        title: 'Total Marks',
        type: 'number'
      }/* ,
      Actions:
      {
        title:'Actions',
        type:'html',
        valuePrepareFunction:(cell,row)=>{
          return `<a style="color:Red" title="See Detail Product "href="Your api key or something/${row.id}">
                  <button class="btn btn-success">View</button></a>`
        },
        filter:false       
      } */
    } 
  };
  
  submittedSettings = {
    actions:{
      position :'right',
      edit:true,
      delete:false
    },
    mode:'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: 'Open',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    hideSubHeader:true,
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      title: {
        title: 'Title',
        type: 'string'
      },
      submittedBy: {
        title: 'Submitted By',
        type: 'string'
      },
      time: {
        title: 'Submited at',
        type: 'string'
      },
      course: {
        title: 'Course',
        type: 'string'
      },
      file: {
        title: 'File',
        type: 'string'
      }
      /* ,
      file: {
        title: 'File',
        type:'html',
        valuePrepareFunction:(cell,row)=>{
          return `<a title="Download" href="${this.DownloadUrl}/${row.file}">
                  <button class="btn btn-success">${row.file}</button></a>`
        },
        filter:false   
      } */
    } 
  };


  source: LocalDataSource = new LocalDataSource();
  submittedSource: LocalDataSource = new LocalDataSource();

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    if(sessionStorage.getItem("userType") == "student"){
      this.settings.edit.editButtonContent="View";
      this.settings.actions.delete=false;
      this._HttpService.getData('submittedAssignments?filter[where][submittedBy][like]='+sessionStorage.getItem("user")).subscribe((data) => {
        data.forEach((data)=>{
          data.time = data.time.substr(0, 10);
        });
        this.submittedSource.load(data);
      });
      let stdAssignmentsUrl = "assignments/studentAssignments?studentId="+sessionStorage.getItem("user");
      this._HttpService.getData(stdAssignmentsUrl).subscribe((data) => {
        
        data.forEach((data)=>{
          data.dueDate = data.dueDate.substr(0, 10);
        });
        this.source.load(data);
        
      });
      
    }
    else{
      this.settings.edit.editButtonContent="Open";
      this.settings.actions.delete=true;
      this._HttpService.getData('submittedAssignments?filter[where][submittedTo][like]='+sessionStorage.getItem("user")).subscribe((data) => {
        data.forEach((data)=>{
          data.time = data.time.substr(0, 10);
        });
        this.submittedSource.load(data);
      });
      this._HttpService.getData('assignments?filter[where][teachersId][like]='+sessionStorage.getItem("user")).subscribe((data) => {
        data.forEach((data)=>{
          data.dueDate = data.dueDate.substr(0, 10);
        });
        this.source.load(data);
      });
    }
    var ServicesCode=[];
    for(var i=1;i<=sessionStorage.length;i++){
      ServicesCode.push(sessionStorage.getItem("code"+i));
    }
    let canManage=false;
    ServicesCode.forEach(function(val){
      if(val=="1015"){
        canManage=true;
      }
    });
    this.canManage=canManage;
        
    
    

    let groupId:any;
    const groupsURL= 'Groups?filter[fields][id]=true&filter[where][name]=instructors';    
    this._HttpService.getData(groupsURL).subscribe((data) => {
      groupId = this._HttpService.getFields(data, 'id',null);
      const teacherNameURL= 'Profiles?filter[fields][id]=true&filter[fields][firstName]=true&filter[fields][lastName]=true&filter[where][groupsId]='+groupId;    
      this._HttpService.getData(teacherNameURL).subscribe((data) => {
        this.teacherNames = data.filter(function(item){
          return item.firstName!="instructor";
        });//this._HttpService.getFields(data, 'firstName',null);
  
      });
    });

    const coursesURL= 'Courses?filter[fields][id]=true&filter[fields][title]=true&filter[fields][instructorsId]=true';
      this._HttpService.getData(coursesURL).subscribe((data) => {
        this.courses = data;
        
      this.teacherCourses = data.filter((course)=>{
        return course.instructorsId == sessionStorage.getItem("user");
      });//this._HttpService.getFields(data, 'name',null);
    });

    //// Alert code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);

    //// End
  }
  teacherCourses : any;
  private file:any;
  public uploadDisable = true;
  uploadAssignment(file){ 
    this.file = file;

    if(file.srcElement.files[0].size > 10485760){
      this.msgs = this._alert.showError("Error", "File is too big (max size is 10 Mb)");
      this.uploadDisable = true;
    }
    else{
      this.uploadDisable = false;
    }
  }

  uploadFile(){
    this._HttpService.uploadFile('assignments', this.file).subscribe((data) => {
        let values= {
          "title" : this.assignment.assignmentTitle,
          "time": new Date(),
          "submittedBy": this.cookies.userId,
          "submittedTo": this.assignment.instructorId,
          "course": this.assignment.coursesId,
          "file": data.result.files.file[0].name,
          "totalMarks": this.assignment.marks,
        }
        console.log(values);
        this._HttpService.postData('submittedAssignments',values);
        this.msgs = this._alert.showSuccess("Success","Assignment Saved");
      },(error)=>{
            this.msgs = this._alert.showError("Error", "Not Saved");
    });
  }

  onGradeAssignmnet(marks){
    let url = 'submittedAssignments/'+ this.assignment.id;
    if(this.assignment.totalMarks>=marks.value){
      this._HttpService.patchData('submittedAssignments/'+ this.assignment.id,{"marks":marks.value}).subscribe((resp)=>{
        if(resp){
          this.msgs = this._alert.showSuccess("Success","Assignment Graded");
        }
        
      });
    }else{
      this.msgs = this._alert.showError("Error", "Can Not Grade more then total marks:"+this.assignment.totalMarks);
    }
    
  }

  onDeleteConfirm(event): void {
    let value=JSON.parse(JSON.stringify(event.data));
     if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      let deleteUrl = 'assignments/'+value.id;
      this._HttpService.deleteData(deleteUrl).subscribe((done) => {
        
          this.msgs=this._alert.showInfo("Info","Assignment Deleted Successfully");
        
      },error => {
        this.msgs = this._alert.showError("Error", "Not Deleted");
      });

    } else {
      event.confirm.reject();
    } 
    
  }
  assignment:any;
  submit(event){
    this.showSubmitForm = true;
    
    this.assignment=event.data;
    this.assignment.course = this.courses.filter((course)=>{
        return course.id == this.assignment.coursesId;
    });
    this.assignment.course = this.assignment.course[0];
    this.assignment.instructor = this.teacherNames.filter((teacher)=>{
      return teacher.id == this.assignment.teachersId;
    });
    this.assignment.instructorId=this.assignment.instructor[0].id;
    this.assignment.instructor=this.assignment.instructor[0];
    this.assignment.instructor=this.assignment.instructor.firstName+" "+this.assignment.instructor.lastName;

  }
  fileHref:string;
  checkAssignment(event){

    console.log(event.data);
    this.fileHref = this._HttpService.baseURL+'containers/assignments/download/'+event.data.file;
    this.showViewForm= true;
    this.showSubmitForm = true;
    this.downloadAssignmentUrl+event.data.file;
    this.assignment=event.data;
    console.log(this.assignment);
    this.assignment.course = this.courses.filter((course)=>{
        return course.id == this.assignment.course;
    });
    this.assignment.course = this.assignment.course[0];
    this.assignment.instructor = this.teacherNames.filter((teacher)=>{
      return teacher.id == this.assignment.submittedTo;
    });
    this.assignment.instructorId=this.assignment.instructor[0].id;
    this.assignment.instructor=this.assignment.instructor[0];
    this.assignment.instructor=this.assignment.instructor.firstName+" "+this.assignment.instructor.lastName;
  }
  back(){
    this.showSubmitForm = false;
    this.showViewForm= false;
  }

/*   public fileUploaderOptions:NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  }; */
  fileName = "";
  uploadAssignmentFile(file){ 
    
        this._HttpService.uploadFile('assignment_files', file).subscribe((data) => {
          if (data) {
            console.log(data);
            this.fileName = data.result.files.file[0].name;
            console.log(this.fileName);
            this.msgs = this._alert.showSuccess("Success", "File upload Successfull");
          }
          else {
            this.msgs = this._alert.showError("Error", "File upload Unsuccessfull");
          }
        });
    
      
      
    }
}

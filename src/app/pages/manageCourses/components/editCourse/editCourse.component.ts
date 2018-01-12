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

import { Router,ActivatedRoute } from '@angular/router';
import { NgUploaderOptions } from 'ngx-uploader';


import { Location } from '@angular/common';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'editCourse',
  templateUrl: './editCourse.html',
  styleUrls: ['./editCourse.scss'],
  providers:[CookieService,AlertService,HttpService,NgbAccordionConfig],
})
export class EditCourse {

  msgs: Message[] = [];
  canChangeInstructor:boolean = false;
  userType:string;
  curriculumChanged:boolean = false;

  cookies:any;
  public instructorNames: any;
  public batchesNames : any;
  id:any;
  public updateForm:FormGroup;
  public title:AbstractControl;
  public description:AbstractControl;
  public purpose:AbstractControl;
  public audience:AbstractControl;
  public requirements:AbstractControl;
  public instructorsId: AbstractControl;
  public batchesId:AbstractControl;
  public curriculum:AbstractControl;

  public purposes:Array<string>;
  public audiences:Array<string>;
  public requirementss:Array<string>;


  curiculum:any;
  curriculums=[{
    "title":"sometitle",
    "lectures":[],
  }];
  courseUpdated=false;
  showLectureTable=false;


  public submitted:boolean = false;


  viewData:boolean=false;
        

  constructor(private location:Location,public route:ActivatedRoute,public router:Router,config:NgbAccordionConfig,protected _alert:AlertService,updatefb:FormBuilder,public cookiesService:CookieService,fb:FormBuilder,protected _HttpService: HttpService)
  {
    config.closeOthers = false;
    config.type = 'info';

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.userType = sessionStorage.getItem('userType');

    this.updateForm = updatefb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'description': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'requirements': [''],
      'purpose': [''],
      'audience': [''],
      'curriculum': [''],
      'instructorsId': [''],
      'batchesId': ['']
    });

    this.title = this.updateForm.controls['title'];
    this.description = this.updateForm.controls['description'];
    this.purpose = this.updateForm.controls['purpose'];
    this.audience = this.updateForm.controls['audience'];
    this.requirements = this.updateForm.controls['requirements'];
    this.instructorsId = this.updateForm.controls['instructorsId'];
    this.batchesId = this.updateForm.controls['batchesId'];

  }


  public onUpdateCourse(values:Object):void {
    let value = JSON.parse(JSON.stringify(values));
    if(this.curriculums.length != 0  || this.curriculumChanged){
      value.curriculum=this.curriculums;
    }
    else{
      delete value.curriculum;
    }
    value.purpose = this.purposes;
    value.audience = this.audiences;
    value.requirements = this.requirementss;
    
    if (this.updateForm.valid) {
      const updateUrl = "Courses/"+this.id+"?access_token="+this.cookies.accessToken;
      this._HttpService.patchData(updateUrl,value).subscribe((data) => {
          if (data){
            this.msgs=this._alert.showSuccess("Success","Cource updated");
            this.updateForm.reset();
            this.ngOnInit();
          }
          else{
            this.msgs = this._alert.showError("Error","Cource not saved");
          }
        });
    }

    this.courseUpdated=false;
  }

  CurriculumTitle = "" ;
  addCurriculum(){
    if(this.CurriculumTitle!=""){
      this.curiculum.title=this.CurriculumTitle;
      this.curriculums.push(this.curiculum);
      this.curiculum = {
        "title":"",
        "lectures":[],
      };
      this.msgs=this._alert.showSuccess("Success","Curriculum added with title : "+this.CurriculumTitle);
      this.CurriculumTitle = "" ;
      console.log(this.curriculums);
      this.showLectureTable=false;
      this.courseUpdated=true;
    }

    else{
      this.msgs = this._alert.showError("Error","Please add Curriculum's title");
    }
    
  }

  Lecturetitle="";
  Lectureintro="";
  addLecture(){
    if(this.Lecturetitle!=""){
      this.curiculum.lectures.push({"title":this.Lecturetitle,"intro":this.Lectureintro});
      this.showLectureTable=true
      this.curriculumTableSource.load(this.curiculum.lectures);
      console.log(this.curiculum);
      this.msgs=this._alert.showSuccess("Success","lecture added to Curriculum");
      this.Lecturetitle="";
      this.Lectureintro="";
    }
    else{
      this.msgs = this._alert.showError("Error","Please Add Lecture's title");
    }
    
  }

  courseFiles = [];
  ngOnInit(){

    this.purposes = [];
    this.audiences= [];
    this.requirementss= [];

    if(this.userType =='admin'){
      this.canChangeInstructor = true;
    }
    this.curiculum = {
      "title":"sometitle",
      "lectures":[],
    };

    this.id=this.route.snapshot.params['id'];

    let url="Courses/"+this.id;
    this._HttpService.getData(url).subscribe((data) => {
      if(data.files){
        let files = data.files;
        files.forEach((file)=>{
          this.courseFiles.push({"name":file});
        });
       
        this.filesTableSource.load(this.courseFiles);
      }
      for(let purpos of data.purpose){
        this.purposes.push(purpos);
      }
      for(let requirement of data.requirements){
        this.requirementss.push(requirement);
      }
      for(let audience of data.audience){
        this.audiences.push(audience);
      }
      if(data.curriculum!=null){
        this.curriculums=data.curriculum;
      }
      this.updateForm.setValue({
        title      : data.title,
        description       : data.description,
        purpose       : data.purpose,
        audience       : data.audience,
        requirements       : data.requirements,
        curriculum       :"data.curriculum",
        instructorsId : data.instructorsId,
        batchesId     : data.batchesId,
    });
    });

    let groupsURL = 'Groups?filter[fields][id]=true&filter[where][name]=instructors';    
    this._HttpService.getData(groupsURL).subscribe((data) => {
      let groupId = this._HttpService.getFields(data, 'id',null);
      const instructorURL= 'Profiles?filter[fields][id]=true&filter[fields][firstName]=true&filter[fields][lastName]=true&filter[where][groupsId]='+groupId;    
      this._HttpService.getData(instructorURL).subscribe((data) => {
        this.instructorNames = data;//this._HttpService.getFields(data, 'firstName',null);
      });
    });

    let batchesUrl = 'Batches?filter[fields][name]=true&filter[fields][id]=true';
      this._HttpService.getData(batchesUrl).subscribe((data) => {
        this.batchesNames = data;
    });
  }

  backToAll(values:Object){

    console.log(this.curriculums);

    if(this.courseUpdated){
      if (window.confirm('You have made some changes. do you want to save?')) {
        this.onUpdateCourse(values);
        /* this.router.navigate(["/pages/manage_courses/courses"]); */
        this.location.back();
      } else {
        this.location.back();
        /* this.router.navigate(["/pages/manage_courses/courses"]); */
      } 
    }else {
      this.location.back();
      /* this.router.navigate(["/pages/manage_courses/courses"]); */
    } 
    
    this.updateForm.reset();
    
  }

  deleteCourse(): void {
      let deleteUrl = 'Courses/'+this.id;
      this._HttpService.deleteData(deleteUrl).subscribe((done) => {
        if(done){
          this.msgs=this._alert.showInfo("Info","Course Deleted Successfully");
          this.updateForm.reset();
        }
      },error => {
        this.msgs = this._alert.showError("Error", "Not Deleted");
      });

      this.courseUpdated=false;
      this.purposes = [];
      this.audiences= [];
      this.requirementss= [];
    
  }

  uploadCoursePic(file){
    
    this._HttpService.uploadFile('course_pic', file).subscribe((data) => {

        this.msgs = this._alert.showSuccess("Success", "Picture Saved");
        this._HttpService.patchData("Courses/"+this.id, {"course_pic":data.result.files.file[0].name});
    },(error)=>{
      this.msgs = this._alert.showError("Error", "Not Saved");
    });
    
  }
    deletePurpose(purpose) {
      const index = this.purposes.indexOf(purpose);
      this.purposes.splice(index, 1);
      console.log(this.purposes);
      this.courseUpdated=true;
    }

    newPurpose(input: HTMLInputElement){
      this.purposes.push(input.value);
      console.log(this.purposes);
      this.courseUpdated=true;
    }

    newRequirement(input: HTMLInputElement){
      this.requirementss.push(input.value);
      console.log(this.requirementss);
      this.courseUpdated=true;
    }

    deleteRequirement(requirement) {
      const index = this.requirementss.indexOf(requirement);
      this.requirementss.splice(index, 1);
      console.log(this.requirementss);
      this.courseUpdated=true;
    }

    deleteAudience(audience) {
      const index = this.audiences.indexOf(audience);
      this.audiences.splice(index, 1);
      console.log(this.audiences);
      this.courseUpdated=true;
    }

    newAudience(input: HTMLInputElement){
      this.audiences.push(input.value);
      console.log(this.audiences);
      this.courseUpdated=true;
    }

    deleteCurriculum(curriculum){
      if(window.confirm('do you want to delete this curriculum?')){
        const index = this.curriculums.indexOf(curriculum);
        this.curriculums.splice(index, 1);
        console.log(this.curriculums);
        this.courseUpdated=true;
        this.curriculumChanged=true;
      } 
      console.log("Delete Event Canceled");
    }

    deleteLecture(event): void {
      this.removeItem(event.data, this.curiculum.lectures);
      event.confirm.resolve(); 
    }

    deleteCurriculumLecture(event,curriculum): void {
      const index = this.curriculums.indexOf(curriculum);
      console.log(event.data)
      this.removeItem(event.data, this.curriculums[index].lectures);
      event.confirm.resolve(); 
    }
      
    
    removeItem(item: any, list: Array<any>) {
      let index = list.map(function (e) {
        return e.title
      }).indexOf(item.title);
      list.splice(index, 1);
    }

    public onUpdateLecture(event):void {
      console.log(event.newData);
      event.confirm.resolve();
    }

    public onUpdateCurriculumLecture(event):void {
      console.log(event.newData);
      event.confirm.resolve();
    }

    curriculumTableSettings = {
      actions: {
        position: 'right',
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
        confirmSave:true ,
        mode:'inline'
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
        intro: {
          title: 'Introduction',
          type: 'string'
        }
      }
    };
  
    curriculumTableSource: LocalDataSource = new LocalDataSource();


    public fileUploaderOptions:NgUploaderOptions = {
      // url: 'http://website.com/upload'
      url: '',
    };

    uploadCourseFile(file){ 
      if(file.srcElement.files[0].size < 10485760){
        this._HttpService.uploadFile('course_file', file).subscribe((data) => {
          console.log(data);
            let fileName = data.result.files.file[0].name;
            this._HttpService.getData('Courses/'+this.id).subscribe((data)=>{
              if(data.files){
                data.files.push(fileName);
                let files = data.files;
                this._HttpService.patchData('Courses/'+this.id,{"files":files});
                this.courseFiles.push({"name":fileName});
                this.filesTableSource.load(this.courseFiles);
              }
            });
            this.msgs = this._alert.showSuccess("Success", "File Saved");
        },(error) => {
          console.log(error);
          this.msgs = this._alert.showError("Error", "File Not Saved");
        });
      }
      else{
        this.msgs = this._alert.showError("Error", "File is too big (max size is 10 Mb)");
      }
      
    }

    filesTableSettings = {
      actions: {
        position: 'right',
        edit: false,
      },
      hideSubHeader:true,
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true,
      },
      columns: {
        name: {
          title: 'File Name',
          type: 'string'
        }
      }
    };
  
    filesTableSource: LocalDataSource = new LocalDataSource();

    deletefile(event){
      this._HttpService.deleteData("containers/course_file/files/"+event.data.name).subscribe((resp)=>{
        
          this.msgs = this._alert.showSuccess("Success", "File Deleted");
          this.courseFiles = this.courseFiles.filter((file)=>{
            return file != event.data;
          })
          this.filesTableSource.load(this.courseFiles);
          this._HttpService.getData('Courses/'+this.id).subscribe((data)=>{
            if(data.files){
              let fileName = event.data.name;
              let files = data.files.filter((file)=>{
                  return file != fileName;
              });
              this._HttpService.patchData('Courses/'+this.id,{"files":files});
            }
          });
      },error =>{
        this.msgs = this._alert.showError("Error", "File Not Deleted");
      });
    }

    fileHref : string;
    /* pdf_File = false;
    docx_File = false;
    pdfSrc: string = this._HttpService.baseURL+'containers/course_file/download/1511415584640_Final year Project Proposal.docx'; */
    onClickFile(event){
      let fileExtension = '.' + event.data.name.split('.').pop();
      this.fileHref = this._HttpService.baseURL+'containers/course_file/download/'+event.data.name;
      /* if(fileExtension == ".pdf"){
        this.pdfSrc = this.fileHref;
        this.pdf_File = true;
      }
      else if(fileExtension == ".docx"){
        this.docx_File = true;
      }
      else{
        
        this.pdf_File = false;
      } */

      window.location.href = this.fileHref;
    }
  
}

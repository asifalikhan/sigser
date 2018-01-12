import {Component} from '@angular/core';
import {FormControl , FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import {CookieService} from 'ng2-cookies';

import { HttpService } from '../../../../services/http.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { AlertService } from '../../../../services/alert.service';
import {Message} from 'primeng/primeng';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import {AccordionModule} from 'primeng/primeng';

import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'viewCourse',
  templateUrl: './viewCourse.html',
  styleUrls: ['./viewCourse.scss'],
  providers:[CookieService,AlertService,NgbAccordionConfig,AccordionModule,HttpService]
})
export class ViewCourse {
  msgs: Message[] = [];
  cookies:any;
  courseId:any;
  public canJoin:boolean=true;
  public joined: boolean=false;
  public saved: boolean = false;
  public disable: boolean = false;
  rating: number;
  reviews: number;
  canRate: boolean = false;
  rated: boolean = false;

  public title:string;
  public description:string;
  public requirements:string;
  public audience:string;
  public purpose:string;
  public curriculums:any;
  public coursePic:string;

  public instructorName:string;
  public instructorDesignation:string;
  public teacherId:string;
  public instructorCompany:string;
  public instructorInstitute:string;
  public instructorPic:string;

  public creatorName:string;
  public creatorDesignation:string;
  public creatorId:string;
  public creatorCompany:string;
  public creatorInstitute:string;
  public creatorPic:string;

  public courseComments = [];
  public profile_pic_url:string;

  constructor(public location:Location,public route:ActivatedRoute,public router:Router,config: NgbAccordionConfig,protected _alert:AlertService,updatefb:FormBuilder,public cookiesService:CookieService,fb:FormBuilder,protected _HttpService: HttpService)
  {
    config.closeOthers = true;
    config.type = 'info';

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
  }

  ngOnInit(){

    var ServicesCode=[];
    for(var i=1;i<=sessionStorage.length;i++){
      ServicesCode.push(sessionStorage.getItem("code"+i));
    }
    let canJoin=false;
    ServicesCode.forEach(function(val){
      if(val=="1008"){
        canJoin=true;
      }
    });
    this.canJoin = canJoin;

    this.courseId= this.route.snapshot.params['id'];

    let url = "studentsCourses?filter[field][id]=true&filter[where][coursesId][like]="+this.courseId
    +"&filter[where][profilesId][like]="+this.cookies.userId;

    this._HttpService.getData(url).subscribe((data) => {
      if(data.length!=0){
        this.joined=true;
        this.canJoin=false;
      }
    });
    let courseCommentUrl = "Courses/"+this.courseId+"/reviews";
    this._HttpService.getData(courseCommentUrl).subscribe((data)=>{
        this.courseComments = data;
    });

    this.profile_pic_url = this._HttpService.baseURL+'containers/profile_pic/download/';

    let courseURL="Courses/"+this.courseId;
   
        this._HttpService.getData(courseURL).subscribe((data) => {
          let courseFiles=[];
          if(data.files){
            let files = data.files;
            files.forEach((file)=>{
              courseFiles.push({"name":file});
            });
           
            this.filesTableSource.load(courseFiles);
          }

          this.title=data.title;
          this.description=data.description;
          this.requirements=data.requirements;
          this.audience=data.audience;
          this.purpose=data.purpose;
          this.curriculums=data.curriculum;
          this.coursePic=this._HttpService.baseURL+'containers/course_pic/download/'+data.course_pic;
          this.rating = data.rating;
          this.reviews = data.reviews;

         this.teacherId=data.instructorsId;
         
          let instructorURL="Profiles/"+this.teacherId;
          this._HttpService.getData(instructorURL).subscribe((data) =>{
            this.instructorName = data.firstName+'  '+data.lastName;
            if(data.profile_pic!=null){
              this.instructorPic=this._HttpService.baseURL+'containers/profile_pic/download/'+data.profile_pic;
            }
            else{
              this.instructorPic=this._HttpService.baseURL+'containers/profile_pic/download/no-photo.png';
            }
            
          });

          this.creatorId=data.creatorsId;
          let creatorURL="Profiles/"+this.creatorId;
          this._HttpService.getData(creatorURL).subscribe((data) =>{
            this.creatorName = data.firstName+'  '+data.lastName;
            this.creatorDesignation = data.designation;
            this.creatorPic=this._HttpService.baseURL+'containers/profile_pic/download/'+data.profile_pic;
          });

          let instructorEducationURl='Profiles/'+this.teacherId+'/educations';
          this._HttpService.getData(instructorEducationURl).subscribe((data) => {
            if(data.length!=0){
              this.instructorInstitute=data[0].institute;
            }
          });

          let instructorExperianceURl='Profiles/'+this.teacherId+'/experiances';
          this._HttpService.getData(instructorExperianceURl).subscribe((data) => {
            if(data.length!=0){
              this.instructorDesignation = data[0].designation;
              this.instructorCompany=data[0].company;
            }
          });

          let creatorEducationURl='Profiles/'+this.creatorId+'/educations';
          this._HttpService.getData(creatorEducationURl).subscribe((data) => {
            if(data.length!=0){
              this.creatorInstitute=data[0].institute;
            }
          });

          let creatorExperianceURl='Profiles/'+this.creatorId+'/experiances';
          this._HttpService.getData(creatorExperianceURl).subscribe((data) => {
            if(data.length!=0){
              this.creatorCompany=data[0].company;
              this.creatorDesignation = data[0].designation;
            }
          });
         
        });
  }

  filesTableSettings = {
    actions: false,
    hideSubHeader:true,
    columns: {
      name: {
        title: 'File Name',
        type: 'string'
      }
    }
  };

  filesTableSource: LocalDataSource = new LocalDataSource();


  onClickFile(event){
    
    let fileHref = this._HttpService.baseURL+'containers/course_file/download/'+event.data.name;
    window.location.href = fileHref;
  }

  joinCourse(){
    let value={"coursesId":this.courseId,"profilesId":this.cookies.userId}
    this._HttpService.postData("studentsCourses",value).subscribe((data) => {
      this.msgs=this._alert.showSuccess("Success","Course Joined");
      this.canJoin=false;
      this.joined=true;
    });
  }

  leaveCourse(){
    let url = "studentsCourses?filter[field][id]=true&filter[where][coursesId][like]="+this.courseId
    +"&filter[where][profilesId][like]="+this.cookies.userId;

    this._HttpService.getData(url).subscribe((data) => {
      if(data.length!=0){
        this._HttpService.deleteData('studentsCourses/'+data[0].id).subscribe((data) => {
          this.msgs=this._alert.showSuccess("Success","Course leaved");
        },error =>{
          this.msgs=this._alert.showError("error","Not deleted");
        });
        this.canJoin=true;
        this.joined=false;
      }
    });
  }
  
  backToAll(){
    this.location.back();
    //this.router.navigate(["/pages/manage_courses/courses"]);
  }

  curriculumTableSettings = {
    hideSubHeader: true,
    actions: null,
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

  saveComment(comment){
    let courseId = this.route.snapshot.params['id'];
    let courseCommentUrl = "Courses/"+courseId+"/reviews";
    let profile_pic
    if(sessionStorage.getItem("profile_pic")!=null){
      profile_pic=sessionStorage.getItem("profile_pic");
    }
    else{
      profile_pic="no-photo.png";
    }
    let values = {
        "comments": comment.value,
        "profilesId": this.cookies.userId,
        "username": sessionStorage.getItem("username"),
        "profile_pic": profile_pic,
    }
    this.courseComments.push(values);
    this._HttpService.postData(courseCommentUrl,values).subscribe((data)=>{
    });

    comment.value="";
  }

  /// ratings///



  ctrl = new FormControl(null, Validators.required);
  
  toggle() {
      if (this.ctrl.disabled) {
        this.ctrl.enable();
      } else {
        this.ctrl.disable();
  
        this.saved = true;
        let iRate = this.ctrl.value;
  
        let courseReviews = 1;
  
        let values = {
          "rating": this.rating,
          "reviews": this.reviews
        }
  
        values.rating = (this.rating + iRate) / (this.reviews + 1);
        values.reviews++;
        this.disable = true;
  
        console.log("values.rating : ", values.rating);
        console.log("values.reviews : ", values.reviews);
  
  
        let id = this.route.snapshot.params['id'];
        if (id != null) {
          let url = "Courses/" + id;
  
          this._HttpService.patchData(url, values).subscribe((data) => {
            if (data != null) {
              this.rated = true;
              this.rating = data.rating;
            }
          });
        }
  
      }
    }
}

import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import { CookieService } from 'ng2-cookies';

import {DialogModule,SharedModule} from 'primeng/primeng';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { AlertService } from '../../services/alert.service';
import {Message} from 'primeng/primeng';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'exams',
  templateUrl: './exams.html',
  styleUrls: ['./exams.scss'],
  providers:[CookieService,LoggerService,AlertService]
})
export class Exams {
  examURL :string;
  postQuestionURL:string;
  updateQurl:string;
  accessToken:string;

  msgs: Message[] = [];

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  public examform:FormGroup;
  public examType:AbstractControl;
  public coursesId:AbstractControl;
  public examTitle:AbstractControl;
  public examDiscription:AbstractControl;
  public examInstructions:AbstractControl;
  public totalMarks:AbstractControl;
  public totalTime:AbstractControl;
  public examStatus:AbstractControl;
  public totalQuestions:AbstractControl;
  public courses:any;
  public courseID:any;
  public instructorId:AbstractControl;
  public questionType:AbstractControl;
  

  public questionform:FormGroup;
  public question:AbstractControl;
  public option1:AbstractControl;
  public option2:AbstractControl;
  public option3:AbstractControl;
  public option4:AbstractControl;
  public opt1IsTrue:AbstractControl;
  public opt2IsTrue:AbstractControl;
  public opt3IsTrue:AbstractControl;
  public opt4IsTrue:AbstractControl;
  public examsId:AbstractControl;
  public qNumber:AbstractControl;
  public qMarks:AbstractControl;

  opt1:Object;
  opt2:Object;
  opt3:Object;
  opt4:Object;
  totalQ:any;
  questionNumber=0;

  public submitted:boolean = false;
  displayAddExamForm: boolean = false;
  displayQuestionSetter: boolean = false;

  constructor(private _menuService: BaMenuService,private slimLoader: SlimLoadingBarService,protected _alert:AlertService,protected logger:LoggerService,protected cookiesService:CookieService,examfb:FormBuilder,questionfb:FormBuilder,protected _HttpService: HttpService) {

    let cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.accessToken= '?access_token='+cookies.accessToken;
    this.examURL = 'Exams?filter[where][instructorId][like]=' + sessionStorage.getItem("user");
    this.postQuestionURL="questions"+this.accessToken;
    
    //this.courseURL= 'Courses?filter[limit]=1';
    //this.courseURL= 'Courses/5970d4a1a709330b1ab06219';
    //this.courseURL= 'Courses/findOne?filter[where][name]=Artificial Inteligance';

    this.examform = examfb.group({
      'examTitle': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'coursesId': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'examDiscription': ['', Validators.compose([Validators.minLength(4)])],
      'examInstructions': ['', Validators.compose([Validators.minLength(4)])],
      'totalMarks': [''],
      'totalTime': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'examStatus': [''],
      'examType': ['Quiz'],
      'totalQuestions': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'questionType': ['Multiple Choice with one true answer'],
      'instructorId': [''],
    });
    this.examType = this.examform.controls['examType'];
    this.questionType = this.examform.controls['questionType'];
    this.examTitle = this.examform.controls['examTitle'];
    this.coursesId = this.examform.controls['coursesId'];
    this.examDiscription = this.examform.controls['examDiscription'];
    this.examInstructions = this.examform.controls['examInstructions'];
    this.totalMarks = this.examform.controls['totalMarks'];
    this.totalTime = this.examform.controls['totalTime'];
    this.examStatus = this.examform.controls['examStatus'];
    this.totalQuestions = this.examform.controls['totalQuestions'];
    this.instructorId = this.examform.controls['instructorId'];

    this.questionform = questionfb.group({
      'question': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'option1': ['', Validators.compose([Validators.required])],
      'opt1IsTrue': [''],
      'option2': ['', Validators.compose([Validators.required])],
      'opt2IsTrue': [''],
      'option3': ['', Validators.compose([Validators.required])],
      'opt3IsTrue': [''],
      'option4': ['', Validators.compose([Validators.required])],
      'opt4IsTrue': [''],
      'examsId': ['', Validators.compose([Validators.required])],
      'qNumber': ['', Validators.compose([Validators.required])],
      'qMarks': ['', Validators.compose([Validators.required])],
    });

    this.question = this.questionform.controls['question'];
    this.option1 = this.questionform.controls['option1'];
    this.opt1IsTrue = this.questionform.controls['opt1IsTrue'];
    this.option2 = this.questionform.controls['option2'];
    this.opt2IsTrue = this.questionform.controls['opt2IsTrue'];
    this.option3 = this.questionform.controls['option3'];
    this.opt3IsTrue = this.questionform.controls['opt3IsTrue'];
    this.option4 = this.questionform.controls['option4'];
    this.opt4IsTrue = this.questionform.controls['opt3IsTrue'];
    this.examsId = this.questionform.controls['examsId'];
    this.qNumber = this.questionform.controls['qNumber'];
    this.qMarks = this.questionform.controls['qMarks'];
  }

  public onSaveExam(values:Object):void {

    if (this.examform.valid) {
      let value = JSON.parse(JSON.stringify(values));
      value.instructorId = sessionStorage.getItem('user');
        this._HttpService.postData(this.examURL,value).subscribe((data) => {
          this.totalQ=data.totalQuestions;
          this.msgs=this._alert.showSuccess("Success","Quiz Saved");
          this.questionSet(data.id);
      });
    }

  }

  public onSaveQuestion(values:Object):void {
    let value=JSON.parse(JSON.stringify(values));

    this.opt1 = { "title":value.option1, "isCorrect": value.opt1IsTrue }
    this.opt2 = { "title":value.option2, "isCorrect": value.opt2IsTrue }
    this.opt3 = { "title":value.option3, "isCorrect": value.opt3IsTrue }
    this.opt4 = { "title":value.option4, "isCorrect": value.opt4IsTrue }

    let answers = [this.opt1, this.opt2,this.opt3,this.opt4];

    values={"qMarks":value.qMarks,"qNumber":this.questionNumber,"title":value.question,"answers":answers,"examsId":value.examsId};

    this.submitted = true;
    if (this.questionform.valid) {
        this._HttpService.postData(this.postQuestionURL,values).subscribe((data) => {
          /* this._success.next('Question Saved with id='+data.id); */
          this.msgs=this._alert.showSuccess("Success","Question Saved");
          this.questionSet(data.examsId);
        });
        
    }
    this.ngOnInit();
  }

  addExam() {
        this.displayAddExamForm = true;
        this.displayQuestionSetter = false;
  }
  examList(){
      this.displayAddExamForm = false;
      this.displayQuestionSetter = false;
  }

  questionSet(exmID:string){
    this.displayAddExamForm = false;
    this.displayQuestionSetter = true;

    if(this.questionNumber<this.totalQ){
        this.questionNumber++;
        this.questionform.reset();
        this.questionform.setValue({
          examsId: exmID,
          qNumber: this.questionNumber,
          qMarks: '',
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          opt1IsTrue: false,
          opt2IsTrue: false,
          opt3IsTrue: false,
          opt4IsTrue: false
        });
    }
    else{
        this.questionform.reset();
          this.msgs=this._alert.showInfo("Info","Exam Questions Completed");
          this.questionNumber=0;
        this.examList();
    }
      
  }

  /*View Table*/
  query: string = '';

  // Table Settings
  settings = {
    actions: {
      position : 'right',
      edit: false, //as an example
      custom: [{ name: 'routeToAPage', title: 'Hello' }]
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
    hideSubHeader:true,
    columns: {
      examType: {
        title: 'Type',
        type: 'string'
      },
      examTitle: {
        title: 'Title',
        type: 'string'
      },
      totalMarks: {
        title: 'Marks',
        type: 'number'
      },
      totalQuestions: {
        title: 'Total Questions',
        type: 'number'
      },
      examStatus: {
        title: 'Is Active',
        type: 'string'
      },
      Actions:
      {
        title:'Actions',
        type:'html',
        valuePrepareFunction:(cell,row)=>{
          return `<a title="See Detail Product "href="/#/pages/examReview/${row.id}">
                  <button class="btn btn-success">View</button></a>`
        },
        filter:false       
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  teacherCourses:any;
  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    this.slimLoader.color = 'green';
    this.slimLoader.start();
    console.log(this.slimLoader.color);
      this._HttpService.getData(this.examURL).subscribe((data) => {
        this.slimLoader.complete();
          this.source.load(data);
        });
      
      
      const courseNameURL= 'Courses?filter[fields][id]=true&filter[fields][title]=true&filter[fields][instructorsId]=true';
      this._HttpService.getData(courseNameURL).subscribe((data) => {
        this.courses = data;

        this.teacherCourses = data.filter((course)=>{
          return course.instructorsId == sessionStorage.getItem("user");
        });
        console.log("this.teacherCourses: ",this.teacherCourses);
      });

       //// Alert code
           /* setTimeout(() => this.staticAlertClosed = true, 20000);
           this._success.subscribe((message) => this.successMessage = message);
          debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null); */
          
          //// End
   }

  onDeleteConfirm(event): void {
    let value=JSON.parse(JSON.stringify(event.data));
     if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      let deleteUrl = 'Exams/' + value.id;
      this._HttpService.deleteData(deleteUrl+'/questions'+this.accessToken).subscribe((done) => {
          this.msgs=this._alert.showInfo("Info","Exam Questions Deleted Successfully");
          this._HttpService.deleteData(deleteUrl).subscribe((done) => {
            
              this.msgs=this._alert.showInfo("Info","Exam Deleted Successfully");
            
          },error => {
            this.msgs = this._alert.showError("Error", "Exam Not Deleted");
          });
      },error => {
        this.msgs = this._alert.showError("Error", "Questions Not Deleted");
      });

    } else {
      event.confirm.reject();
    } 
    
  }
}

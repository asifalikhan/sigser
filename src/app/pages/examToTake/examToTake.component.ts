import { Component, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import { CookieService } from 'ng2-cookies';

import {DialogModule,SharedModule} from 'primeng/primeng';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

import {Observable, Subscription } from 'rxjs/Rx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from './default-modal/default-modal.component';

@Component({
  selector: 'examToTake',
  templateUrl: './examToTake.html',
  styleUrls: ['./examToTake.scss'],
  providers:[CookieService,LoggerService]
})
export class ExamToTake {
  examURL :string;
  postAnswerURL:string;
  updateQurl:string;
  accessToken:string;

  secounds =60;
  minutes = 0;
  showTimer=false;
  private sub: Subscription;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  public courseIds:any;
  public courseID:any;
  
  public questionform:FormGroup;
  public question:AbstractControl;
  public option1:AbstractControl;
  public option2:AbstractControl;
  public option3:AbstractControl;
  public option4:AbstractControl;
  public trueOption:AbstractControl;
  public examsId:AbstractControl;

  totalQ:any;
  questionNumber=1;
  tempData:Object;
  studentId:string;
  questionId:any;
  qMarks:any;
  tns = null;

  private totalMarks:number;
  private obtainedMarks=0;
  private examTitle:string;
  private type:string;

  public submitted:boolean = false;

    displayQuestionSetter: boolean = false;

    examList(){
      this.displayQuestionSetter = false;
    }

    questionSet(exmID:string){
      this.displayQuestionSetter = true;

      if(this.questionNumber<=this.totalQ){

      }
      else{
        this.questionform.reset();
          this._success.next(`Exam Question Completed`);
        this.examList();
      }
      
    }

  constructor(private modalService: NgbModal,private _menuService: BaMenuService,protected logger:LoggerService,protected cookiesService:CookieService,examfb:FormBuilder,questionfb:FormBuilder,protected _HttpService: HttpService) {

    let cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.accessToken = '?access_token='+cookies.accessToken;
    this.studentId=cookies.userId;
    this.examURL = "Exams"+this.accessToken;
    this.postAnswerURL="Answers"+this.accessToken;


    this.questionform = questionfb.group({
      'question': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'option1': ['', Validators.compose([Validators.required])],
      'option2': ['', Validators.compose([Validators.required])],
      'option3': ['', Validators.compose([Validators.required])],
      'option4': ['', Validators.compose([Validators.required])],
      'examsId': ['', Validators.compose([Validators.required])],
      'trueOption': ['', Validators.compose([Validators.required])],
    });

    this.question = this.questionform.controls['question'];
    this.option1 = this.questionform.controls['option1'];
    this.option2 = this.questionform.controls['option2'];
    this.option3 = this.questionform.controls['option3'];
    this.option4 = this.questionform.controls['option4'];
    this.trueOption = this.questionform.controls['trueOption'];
    this.examsId = this.questionform.controls['examsId'];
  }

  /*View Table*/
  query: string = '';

  // Table Settings
  settings = {
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
      mode:'inline',
    },
    hideSubHeader:true,
    actions: null,
    columns: {
      examType: {
        title: 'Type',
        type: 'string',
        filter:false
      },
      examTitle: {
        title: 'Title',
        type: 'string',
        filter:false
      },
      coursesId: {
        title: 'Course Id',
        type: 'string',
        filter:false
      } ,
      totalMarks: {
        title: 'Marks',
        type: 'number',
        filter:false
      },
      totalQuestions: {
        title: 'Total Questions',
        type: 'number',
        filter:false
      },
      examStatus: {
        title: 'Active',
        type: 'string',
        filter:false
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit(){ 
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

    

    console.log(this.studentId);
      this._HttpService.getData(this.examURL).subscribe((data) => {
          this.source.load(data);
        });
      
      
      const courseNameURL= 'Courses?filter[fields][name]=true';
      this._HttpService.getData(courseNameURL).subscribe((data) => {
        this.courseIds = this._HttpService.getFields(data, 'name',null);
      });

       //// Alert code
           setTimeout(() => this.staticAlertClosed = true, 20000);
           this._success.subscribe((message) => this.successMessage = message);
          debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);

          //// End
   }

  onDeleteConfirm(event): void {
      alert("Sorry You can't delete it");
  }

  onSelect(event):void{
      if (window.confirm('Are you sure you want to attempt this Assesment know?')) {
        

      let values=JSON.parse(JSON.stringify(event.data));
      this.totalMarks = values.totalMarks;
      this.examTitle = values.examTitle;
      this.type = values.examType;
      this.displayQuestionSetter=true;
      let examQuestionsURL="Exams/"+values.id+"/questions"+this.accessToken;
      this.totalQ=values.totalQuestions;
      this.examsId=values.id;
      this.minutes = values.totalTime;

      this._HttpService.getData(examQuestionsURL).subscribe((data) => {

        this.tempData=data;
        this.questionNumber=1;
        this.readQuestion();
        let timer = Observable.timer(2000,1000);
        timer.subscribe(t=>this.secounds= this.secounds-1);
        let timer2 = Observable.timer(2000,10000);
        this.sub = timer2.subscribe(t2=> {
          console.log("time check");
            if(this.minutes==0){
              console.log("time end");
              this.showTimer=false;
              this.childModalShow();
            }
            else{
              this.minutes = this.minutes-1;
            }
            
        });
        this.showTimer=true;

      });

    }
  }

  ngOnDestroy(){
    // unsubscribe here
    this.sub.unsubscribe();

}

childModalShow() {
  this.sub.unsubscribe();
  const activeModal = this.modalService.open(DefaultModal, {size: 'sm',backdrop: 'static'});
  activeModal.componentInstance.modalHeader = 'Time Up!';
  activeModal.componentInstance.modalContent = `you can see your result in grade list.`;
}


  public saveAndNext(values:Object):void {

    let value=JSON.parse(JSON.stringify(values));
    let answer:any;
    if(value.trueOption== 'option1'){
      answer=value.option1;
    }
    else if(value.trueOption=="option2"){
      answer=value.option2;
    }
    else if(value.trueOption=="option3"){
      answer=value.option3;
    }
    else{
      answer=value.option4;
    }
    let qMarks=0;
if(answer==this.tns){
  qMarks = this.qMarks
  this.obtainedMarks=this.obtainedMarks+this.qMarks;
}
    values = {"studentId":this.studentId,"examsId":this.examsId,"questionsId":this.questionId,"answer":answer,"trueAnswer":this.tns,"questionMarks":qMarks};
    console.log(values);

    this._HttpService.postData(this.postAnswerURL,values).subscribe((data) => {
      if(data!=null){
        console.log("Answer Saved");
      }
      else{
        console.error("Error Occured");
      }
    });

    this.questionNumber++;
    this.questionform.reset();
    this.readQuestion();

  }

  public readQuestion(){
    if(this.questionNumber<=this.totalQ){

      this.questionId = this._HttpService.getField(this.tempData, 'id',this.questionNumber-1);
      this.questionId = this.questionId[0];
      this.qMarks = this._HttpService.getField(this.tempData, 'qMarks',this.questionNumber-1);
      this.qMarks = this.qMarks[0];
      let examId = this._HttpService.getField(this.tempData, 'examsId',this.questionNumber-1);
      let Q = this._HttpService.getField(this.tempData, 'title',this.questionNumber-1);
      let ans = this._HttpService.getField(this.tempData, 'answers',this.questionNumber-1);
      let ans1=ans[0][0]["title"];
      let ans2=ans[0][1]["title"];
      let ans3=ans[0][2]["title"];
      let ans4=ans[0][3]["title"];
      let trueAnswer = ans[0].filter(function(answer){
        return answer.isCorrect=="true";
      });
      this.tns = trueAnswer[0].title;

      this.questionform.setValue({
        examsId: examId,
        question: Q,
        option1: ans1,
        option2: ans2,
        option3: ans3,
        option4: ans4,
        trueOption: false,
      });
    }
    else
    {
      this.questionform.reset();
      this._success.next(`Exam Completed you can check your marks in grade section`);
      this.examList();
      let postGradeURL="courseGrades"+this.accessToken;
      let values = {"studentId":this.studentId,"title":this.examTitle,"totalMarks":this.totalMarks,"obtainedMarks":this.obtainedMarks,"type":this.type}
      this._HttpService.postData(postGradeURL,values);
    }
  }
}

import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import { CookieService } from 'ng2-cookies';

import {DialogModule,SharedModule} from 'primeng/primeng';
import { Location } from '@angular/common';
import { Routes,ActivatedRoute } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';
import { Message } from 'primeng/primeng';
import { AlertService } from '../../services/alert.service';
@Component({
  selector: 'examReview',
  templateUrl: './examReview.html',
  styleUrls: ['./examReview.scss'],
  providers:[CookieService,LoggerService,AlertService]
})
export class ExamReview {
  cookies:any;
  quiz:any;
  questions:any;
  quizId:string;
  msgs: Message[] = [];
  
  protected updateForm:FormGroup;
  protected examTitle:AbstractControl;
  protected examDiscription:AbstractControl;
  protected examInstructions:AbstractControl;
  protected totalMarks:AbstractControl;
  protected totalTime:AbstractControl;

  protected question:AbstractControl;
  protected questionform:FormGroup;
  protected option1:AbstractControl;
  protected option2:AbstractControl;
  protected option3:AbstractControl;
  protected option4:AbstractControl;
  protected opt1IsTrue:AbstractControl;
  protected opt2IsTrue:AbstractControl;
  protected opt3IsTrue:AbstractControl;
  protected opt4IsTrue:AbstractControl;
  protected qMarks:AbstractControl;
  
  protected trueOption:AbstractControl;

  constructor(private location:Location,protected _alert: AlertService,private _HttpService:HttpService,public route:ActivatedRoute,protected cookiesService:CookieService,private _menuService: BaMenuService,_formBuilder:FormBuilder){
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.updateForm = _formBuilder.group({
      'examTitle': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'examDiscription': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'examInstructions': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalTime': [''],
      'totalMarks': ['']
    })

    this.examTitle = this.updateForm.controls['examTitle'];
    this.examDiscription = this.updateForm.controls['examDiscription'];
    this.examInstructions = this.updateForm.controls['examInstructions'];
    this.totalMarks = this.updateForm.controls['totalMarks'];
    this.totalTime = this.updateForm.controls['totalTime'];

    this.questionform = _formBuilder.group({
      'question': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'option1': ['', Validators.compose([Validators.required])],
      'opt1IsTrue': [''],
      'option2': ['', Validators.compose([Validators.required])],
      'opt2IsTrue': [''],
      'option3': ['', Validators.compose([Validators.required])],
      'opt3IsTrue': [''],
      'option4': ['', Validators.compose([Validators.required])],
      'opt4IsTrue': [''],
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
    this.qMarks = this.questionform.controls['qMarks'];
  }
  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

    this.quizId= this.route.snapshot.params["id"];

    let quizURL = "Exams/"+this.quizId+'?access_token='+this.cookies.accessToken;
    this._HttpService.getData(quizURL)
      .subscribe(
        (resp)=>{
          this.quiz = resp;
          this.updateForm.setValue({
              examTitle: this.quiz.examTitle,
              examDiscription: this.quiz.examDiscription,
              examInstructions: this.quiz.examInstructions,
              totalMarks: this.quiz.totalMarks,
              totalTime: this.quiz.totalTime
          })
        },
        error => {
          console.log(error);
        }
      );

    let examQuestionsURL="Exams/"+this.quizId+"/questions"+'?access_token='+this.cookies.accessToken;

    this._HttpService.getData(examQuestionsURL)
    .subscribe(
      (resp)=>{
        this.questions = resp;
      },
      error => {
        console.log(error);
      }
    );
  }

  public onQuizUpdate(values: Object): void {
    if (this.updateForm.valid) {

      let quizUpdateURL = "Exams/"+this.quizId+'?access_token='+this.cookies.accessToken;

      this._HttpService.patchData(quizUpdateURL, values)
      .subscribe(
        (resp) => {
          this.msgs = this._alert.showSuccess("Success", "Changes Saved");
        
      },
      (error)=>{
          this.msgs = this._alert.showError("Error", "Not Saved");
      });
    }
  }

  public setQuestion(values:Object):void {
    let value=JSON.parse(JSON.stringify(values));

    let opt1 = { "title":value.option1, "isCorrect": value.opt1IsTrue }
    let opt2 = { "title":value.option2, "isCorrect": value.opt2IsTrue }
    let opt3 = { "title":value.option3, "isCorrect": value.opt3IsTrue }
    let opt4 = { "title":value.option4, "isCorrect": value.opt4IsTrue }

    let answers = [opt1, opt2,opt3,opt4];

    values={"qMarks":value.qMarks,"title":value.question,"answers":answers,"examsId":this.quizId};

    let questionURL = "Exams/"+this.quizId+'/questions?access_token='+this.cookies.accessToken;
    console.log(values);
    if (this.questionform.valid) {
        this._HttpService.postData(questionURL,values)
        .subscribe(
          (resp) => {
            this.msgs = this._alert.showSuccess("Success", "Question Saved");
            $("#myModal").modal("hide");
            this.ngOnInit();
        },
        (error)=>{
            this.msgs = this._alert.showError("Error", "Not Saved");
        });
        
    }
    
  }

  qEdit=false;
  id:any;
  public setQuestion2(question:any){
    this.qEdit=true;
    this.id = question.id;
  }

  public updateQuestion(question:any){
    let updateQuestionURL = "Exams/"+this.quizId+"/questions/"+question.id+'?access_token='+this.cookies.accessToken;
    delete question.id;
    this._HttpService.putData(updateQuestionURL, question)
    .subscribe(
      (resp) => {
        this.msgs = this._alert.showSuccess("Success", "Changes Saved");
      
    },
    (error)=>{
        this.msgs = this._alert.showError("Error", "Not Saved");
    });
  }

  public deleteQuestion(question:any){
    let deleteQuestionsURL="Exams/"+this.quizId+"/questions/"+question.id+'?access_token='+this.cookies.accessToken;

    this._HttpService.deleteData(deleteQuestionsURL)
    .subscribe(
      (resp) => {
        this.msgs = this._alert.showSuccess("Success", "Question deleted");
        this.ngOnInit();
    },
    (error)=>{
        this.msgs = this._alert.showError("Error", "Not deleted");
    });
  }

  back(){
    this.location.back();
  }
}

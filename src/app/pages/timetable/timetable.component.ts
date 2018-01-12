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

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'timetable',
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss'],
  providers:[CookieService,LoggerService,AlertService]
})
export class Timetable {
  accessToken:string;

  public form:FormGroup;
  public courseTitle:AbstractControl;
  public courses:any;
  public startTime:AbstractControl;
  public endTime:AbstractControl;
  public days:AbstractControl;
  public submitted:boolean = false; 

  msgs: Message[] = [];

  constructor(private _menuService: BaMenuService,protected _alert:AlertService,public cookiesService:CookieService,fb:FormBuilder,protected _HttpService: HttpService)
  {
    let cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.accessToken= '?access_token='+cookies.accessToken;
    
    

    this.form = fb.group({
      'courseTitle': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'startTime': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'endTime': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'days': [''],
    });

    this.courseTitle = this.form.controls['courseTitle'];
    this.startTime = this.form.controls['startTime'];
    this.endTime = this.form.controls['endTime'];
    this.days = this.form.controls['days'];
  }

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    let courseURL = 'Courses?filter[fields][id]=true&filter[fields][title]=true&filter[where][instructorsId][like]=' + sessionStorage.getItem("user");
      this._HttpService.getData(courseURL).subscribe((data) => {
        this.courses = data;
      });
  }

  public onSave(values:Object):void {

    this.submitted = true;
    let value = JSON.parse(JSON.stringify(values));
    value.days = this.weekClass;
    let course =  this.courses.filter((course)=>{
      return course.title == value.courseTitle;
    })
    if (this.form.valid) {
      let URL = "Courses/"+course[0].id+"/classtime"+this.accessToken;
      this._HttpService.getData(URL).subscribe((data) => {
        if(data!=null){
          this._HttpService.putData(URL,value).subscribe((data) => {
            if(data!=null){
              this.msgs=this._alert.showSuccess("Success","Schedule Updated");
              this.ngOnInit();
              this.form.reset();
            }
            else{
              this.msgs=this._alert.showError("Error","must provide valid entries");
            }
          });
        }
        else{
          this._HttpService.postData(URL,value).subscribe((data) => {
            if(data!=null){
              this.msgs=this._alert.showSuccess("Success","Schedule Saved");
              this.ngOnInit();
              this.form.reset();
            }
            else{
              this.msgs=this._alert.showError("Error","must provide valid entries");
            }
          });
        }
      });
       
    }

  }


  weekClass: Array<string>=[];
  addDay(day){
    
    this.weekDays.forEach((dayy)=>{
      if(dayy.Value == day.Value){
        dayy.Checked = !dayy.Checked;
        if(dayy.Checked){
          this.weekClass.push(day.Value);
        }
        else{
          this.weekClass = this.weekClass.filter((dayyy)=>{
            return dayyy != day.Value;
          })
          console.log(this.weekClass);
        }
      }
    });
  }

  weekDays = [
    {
      id: 'daySu0',
      Name: 'Sunday',
      Value: '0',
      Checked: false
    },
    {
      id: 'dayMo0',
      Name: 'Monday',
      Value: '1',
      Checked: false
    },
    {
      id: 'dayTu0',
      Name: 'Tuesday',
      Value: '2',
      Checked: false
    },
    {
      id: 'dayWe0',
      Name: 'Wednesday',
      Value: '3',
      Checked: false
    },
    {
      id: 'dayTh0',
      Name: 'Thursday',
      Value: '4',
      Checked: false
    },
    {
      id: 'dayFr0',
      Name: 'Friday',
      Value: '5',
      Checked: false
    },
    {
      id: 'daySa0',
      Name: 'Saturday',
      Value: '6',
      Checked: false
    }
  ];

}

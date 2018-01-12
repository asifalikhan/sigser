import {Component, OnInit} from '@angular/core';


import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

import { HttpService } from '../../services/http.service';
import { Router,ActivatedRoute } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import {Message} from 'primeng/primeng';

@Component({
  selector: 'app-fileshare',
  templateUrl: './fileshare.component.html',
  styleUrls: ['./fileshare.component.scss'],
  providers: [HttpService,AlertService],
})
export class FileshareComponent implements OnInit {
  msgs: Message[] = [];
  courses:any;
  userType:string;

  constructor(protected _alert:AlertService,public route:ActivatedRoute,public router:Router,protected _HttpService: HttpService,private _menuService: BaMenuService) {

  }
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    this.userType = sessionStorage.getItem("userType")
          if(this.userType =='instructor'){
            let courseURL = 'Courses?filter[where][instructorsId][like]=' + sessionStorage.getItem("user");
            this._HttpService.getData(courseURL).subscribe((data) => {
              this.courses= data;
            });
          }

          if(this.userType =='student'){
            let stdCoursesUrl = "studentsCourses/courses?id=" + sessionStorage.getItem("user");
            this._HttpService.getData(stdCoursesUrl).subscribe((data) => {
              this.courses= data;
            });
          }
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString().
      replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
  }

  getCurrentDate() {
    let d = new Date();
    let date = d.toISOString();
    date = date.substring(0,10);
    return date;
  }

  joinClass(event){
    console.log(event);

    this.router.navigate(["/pages/class_room/",event.id]);
    
    if(sessionStorage.getItem("userType") == 'instructor'){

      this._HttpService.postData("GroupChats", { "messages": "[]" }).subscribe((resp) => {
        this._HttpService.patchData("Courses/" + event.id, { "chatId": resp.id }).subscribe((resp)=>{
          console.log(resp);
        });
        sessionStorage.setItem("groupChatId", resp.id);
      });

      let attendanceUrl = "Courses/"+event.id+"/attendances?filter[where][date][like]=" + this.getCurrentDate();
      this._HttpService.getData(attendanceUrl).subscribe((resp) => {
        if(resp.length == 0){
          let values = {
            "courseName":event.title,
            "date":this.getCurrentDate(),
            "students": [],
          };
          this._HttpService.postData("Courses/"+event.id+"/attendances",values).subscribe((resp) => {
            this.msgs=this._alert.showInfo("Info","Class Attendance Initiated");
          });
        }
      });
    }
    if(sessionStorage.getItem("userType") == 'student'){

      let GroupChatIDurl = "Courses/" + event.id + "?filter[field][chatId]=true";
      this._HttpService.getData(GroupChatIDurl).subscribe((data) => {
        sessionStorage.setItem("groupChatId", data.chatId);
      });

      let attendance = {
        "studentId":sessionStorage.getItem("user"),
        "username":sessionStorage.getItem("username"),
        "status":"Present",
        "joiningTime":this.getCurrentTime(),
      };
      let attendanceUrl = "Courses/"+event.id+"/attendances?filter[where][date][like]=" + this.getCurrentDate();

      this._HttpService.getData(attendanceUrl).subscribe((resp) => {
        resp[0].students.forEach((student)=>{
          if(student.username == sessionStorage.getItem("username")){
            attendance = null;
          }
        });
        if(attendance != null){
          let id = resp[0].id;
          delete resp[0]["id"];
          resp[0].students.push(attendance);
          this._HttpService.patchData("Attendances/"+id,resp[0]).subscribe((resp) => {
            this.msgs=this._alert.showInfo("Info","Your Attendance Marked");
          });
        }
      });
    }

  }

}

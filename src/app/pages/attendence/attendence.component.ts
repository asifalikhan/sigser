import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ng2-cookies';

import { HttpService } from '../../services/http.service';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

import { BaThemeConfigProvider } from '../../theme';
import * as jQuery from 'jquery';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from './default-modal/default-modal.component';

@Component({
  selector: 'attendence',
  templateUrl: './attendence.html',
  styleUrls: ['./attendence.scss'],
  providers: [CookieService]

})
export class Attendence {

  public calendarConfiguration: any;
  public _calendar: Object;

  calendarColors = this._baConfig.get().colors.dashboard;
  events = []

  courses: any;
  showCalander = false;

  constructor(private modalService: NgbModal,private _menuService: BaMenuService, public cookiesService: CookieService, protected _HttpService: HttpService, private _baConfig: BaThemeConfigProvider) {
    this.calendarConfiguration = this.getEvents();
    this.calendarConfiguration.eventClick = (event) => this._onSelect(event);
    this.childModalShow();
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    let userType = sessionStorage.getItem("userType");
    if (userType == 'instructor') {
      let courseURL = 'Courses?filter[where][instructorsId][like]=' + sessionStorage.getItem("user");
      this._HttpService.getData(courseURL).subscribe((data) => {
        this.courses = data;
        console.log(data);
        this.viewAttendance(data);
      });
    }

    if (userType == 'student') {
      let stdCoursesUrl = "studentsCourses/courses?id=" + sessionStorage.getItem("user");
      this._HttpService.getData(stdCoursesUrl).subscribe((data) => {
        this.courses = data;
        console.log(data);
        this.viewAttendance(data);
      });
    }


  }

  childModalShow() {
    const activeModal = this.modalService.open(DefaultModal, {size: 'sm'});
    activeModal.componentInstance.modalHeader = 'Hint!';
    activeModal.componentInstance.modalContent = `Click on any class to see its attendance.`;
  }
  courseId: string;
  courseTitle: string;
  viewAttendance(courses) {
    let calendarColors = this._baConfig.get().colors.dashboard;
    console.log(calendarColors);
    courses.forEach((cours) => {
      let attendanceUrl = "Courses/" + cours.id + "/attendances";
      console.log(attendanceUrl);
          this._HttpService.getData(attendanceUrl).subscribe((data) => {
            console.log(data);
            let event = []
            data.forEach(function (evnt) {
              event.push({
                id: cours.id,
                title: evnt.courseName,
                start: evnt.date,
                end: evnt.date,
                color: "#"+cours.id.substring(18,25)//calendarColors.surfieGreen//#3c4eb9//gossip//#00abff
              });
            })
            for (var i = 0; i < event.length; i++) {
              jQuery(this._calendar).fullCalendar('renderEvent', event[i], true);
            }
          });
    });
  
  }

  getEvents() {
    return {
      fixedWeekCount: false,
      height: 500,
      header: {
        colors: this.calendarColors.surfieGreen
      },
      selectable: false,
      editable: true,
      eventLimit: true,
      events: this.events
    };
  }

  public onCalendarReady(calendar): void {
    this._calendar = calendar;
  }
  date:string;
  private _onSelect(event): void {
    
    console.log(event);
    this.date = event.start._i;
    this.courseTitle = event.title.substring(0,25)+"...";
    let attendanceUrl = "Courses/" + event.id + "/attendances?filter[where][date][like]=" + this.date;

    this._HttpService.getData(attendanceUrl).subscribe((resp) => {
      resp[0].students.forEach((student) => {
      });
      this.source.load(resp[0].students);
      $("#myModal").modal("show");
    });
  }

  query: string = '';

  settings = {
    actions: false,
    columns: {
      username: {
        title: 'Student',
        type: 'string'
      },
      status: {
        title: 'Status',
        type: 'string'
      },
      joiningTime: {
        title: 'Join Time',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  back() {
    this.showCalander = false;
  }
}

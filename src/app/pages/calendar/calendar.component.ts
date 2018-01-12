import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../services/http.service';

import {DialogModule,SharedModule} from 'primeng/primeng';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import {BaThemeConfigProvider} from '../../theme';
import * as jQuery from 'jquery';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss','../../../../node_modules/fullcalendar/dist/fullcalendar.min.css'],
  providers:[HttpService]
})
export class Calendar {

    public calendarConfiguration:any;
    public _calendar:Object;

    calendarColors = this._baConfig.get().colors.dashboard;
    events=[]

  constructor(private _menuService: BaMenuService,protected _HttpService: HttpService,private _baConfig:BaThemeConfigProvider) 
  {
      this.calendarConfiguration = this.getEvents();
      this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);
  }

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    this._HttpService.getData("TimeTables").subscribe((data) => {
      let event=[]
      let calendarColors = this._baConfig.get().colors.dashboard;
      let a = 0;
      data.forEach(function(evnt){
        let colors:string;
        a++;
        if(a == 1){
          colors = calendarColors.surfieGreen;
        }else if (a==2){
          colors = calendarColors.silverTree;
        }else if(a==3){
          colors = calendarColors.blueStone;
        }else{
          colors = calendarColors.gossip;
        }
        event.push({
          title: evnt.courseTitle,
          start: evnt.startTime,
          end: evnt.endTime,
          color: colors,//"#"+evnt.id.substring(6,12),//calendarColors.surfieGreen,
          dow: evnt.days
        });
      })
      for(var i=0;i<event.length;i++){
        jQuery(this._calendar).fullCalendar('renderEvent', event[i], true);
      }
    });

    this._HttpService.getData("DateSheets").subscribe((data) => {
      let event=[]
      let calendarColors = this._baConfig.get().colors.dashboard;
      data.forEach(function(evnt){
        event.push({
          title: 'Quiz: '+evnt.examTitle,
          start: evnt.examDate+"T"+evnt.startTime,
          end: evnt.examDate+"T"+evnt.endTime,
          color: calendarColors.gossip
        });
      })
      for(var i=0;i<event.length;i++){
        jQuery(this._calendar).fullCalendar('renderEvent', event[i], true);
      }
    });
    
  }

  getEvents() {
    return {
      fixedWeekCount : false,
      height: 500,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay',
        colors: this.calendarColors.surfieGreen
      },
      dayRender: function (date, cell) {
        
        var today = new Date();
        
        /* if (date.date() === today.getDate()) {
            cell.css("background-color", "#88afc5");
        } */
      
      },
      selectable:false,
      editable: false,
      eventLimit: true,
      events: this.events
    };
  }
  
  public onCalendarReady(calendar):void 
  {
    this._calendar = calendar;
  }
  
  private _onSelect(start, end):void 
  {     
    let eventData;
    let title = prompt("Enter title for the event");
    if (title) {
      eventData = {
        title: title,
        start: start,
        end: end
      };
      jQuery(this._calendar).fullCalendar('renderEvent', eventData, true);
    }
    jQuery(this._calendar).fullCalendar('unselect');
  }  
}
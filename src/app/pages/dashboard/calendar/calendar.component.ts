import {Component} from '@angular/core';
import * as jQuery from 'jquery';

import { HttpService } from '../../../services/http.service';
import {CalendarService} from './calendar.service';
import {BaThemeConfigProvider} from '../../../theme';
@Component({
  selector: 'calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
  providers: [HttpService]
})
export class Calendar {

  public calendarConfiguration:any;
  private _calendar:Object;

  calendarColors = this._baConfig.get().colors.dashboard;
  events=[]

  constructor(protected _HttpService: HttpService,private _baConfig:BaThemeConfigProvider,private _calendarService:CalendarService) {
    this.calendarConfiguration = this._calendarService.getData();
    this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);
  }

  ngOnInit(){
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

  public onCalendarReady(calendar):void {
    this._calendar = calendar;
  }

  private _onSelect(start, end):void {
    if (this._calendar != null) {
      let title = prompt('Event Title:');
      let eventData;
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
}

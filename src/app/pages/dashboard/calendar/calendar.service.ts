import {Injectable} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';

@Injectable()
export class CalendarService {

  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getData() {

    let dashboardColors = this._baConfig.get().colors.dashboard;
    return {
      fixedWeekCount : false,
      height: 500,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay',
        colors: dashboardColors.surfieGreen
      },
      dayRender: function (date, cell) {
        
        /* var today = new Date().getDay();
        console.log(today); */
        /* console.log(date._d.getDay());
        if (date._d.getDay() === today) {
            cell.css("background-color", "#88afc5");
        } */

       /*  if (date.date() === today.getDate()) {
          cell.css("background-color", "#88afc5");
      } */
        
      
      },
      selectable:false,
      editable: false,
      eventLimit: true,
      events: []
    };
  }
}

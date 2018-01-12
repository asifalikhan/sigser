import { NgModule }     from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Calendar } from './calendar.component';
import { routing }       from './calendar.routing';

import { HttpService } from '../../services/http.service';
import {CalendarComponent} from "ap-angular2-fullcalendar/src/calendar/calendar";
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),
    routing
  ],
  declarations: [
    Calendar,CalendarComponent
  ],
  providers: [HttpService]
})
export class CalendarModule {}

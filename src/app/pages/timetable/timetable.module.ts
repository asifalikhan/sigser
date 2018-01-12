import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Timetable } from './timetable.component';
import { routing }       from './timetable.routing';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),GrowlModule,
    routing
  ],
  declarations: [
    Timetable
  ],
  providers: [HttpService]
})
export class TimetableModule {}

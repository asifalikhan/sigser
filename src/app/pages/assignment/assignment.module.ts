import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Assignment } from './assignment.component';
import { routing } from './assignment.routing';

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
    Assignment
  ],
  providers: [HttpService]
})
export class AssignmentModule {}

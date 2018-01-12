import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Attendence } from './attendence.component';
import { routing } from './attendence.routing';

import { HttpService } from '../../services/http.service';

import { DefaultModal } from './default-modal/default-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),
    routing,NgbModalModule
  ],
  declarations: [
    Attendence,
    DefaultModal
  ],
  entryComponents: [
    DefaultModal
  ],
  providers: [HttpService]
})
export class AttendenceModule {}

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { Exams } from './exams.component';
import { routing }       from './exams.routing';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),SlimLoadingBarModule.forRoot(),GrowlModule,
    routing
  ],
  declarations: [
    Exams
  ],
  providers: [HttpService]
})
export class ExamsModule {}

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Users } from './users.component';
import { routing }       from './users.routing';

import { HttpService } from '../../services/http.service';
import {GrowlModule,DialogModule,SharedModule,Message} from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),
    routing,GrowlModule,ProgressBarModule
  ],
  declarations: [
    Users
  ],
  providers: [HttpService]
})
export class UsersModule {}

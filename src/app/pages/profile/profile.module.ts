import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Profile } from './profile.component';
import { routing }       from './profile.routing';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SmartTableModule,
    NgaModule,
    NgbModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    routing,
    GrowlModule
  ],
  declarations: [
    Profile
  ],
  providers: [HttpService]
})
export class ProfileModule {}

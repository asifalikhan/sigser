import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';

import { routing } from './account.routing';
import { Account } from './account.component';
import { Profile } from './components/profile/profile.component';
import { Info } from './components/info/info.component';
import { Viewprofile } from './components/viewprofile/viewprofile.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { Skills } from './components/profile/components/skills';
import { Educations } from './components/profile/components/educations';
import { Experiences } from './components/profile/components/experiences';
import { ChangePassword } from './components/profile/components/changePassword';
import { PersonalDetails } from './components/profile/components/personalDetails';

import { TagInputModule } from 'ngx-chips';
import { Typeahead } from 'ng2-typeahead';

import {FieldsetModule} from 'primeng/primeng';

import {AccordionModule} from "ng2-accordion";


@NgModule({
  imports: [
    ReactiveFormsModule,
    NgbModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    GrowlModule,
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    DataTableModule,
    HttpModule,
    HotTableModule,
    TagInputModule,AccordionModule
  ],
  declarations: [
    Account,
    Profile,
    Info,
    Viewprofile,
    Skills,
    Educations,
    Experiences,
    ChangePassword,PersonalDetails,
    Typeahead
  ]
})
export class AccountsModule {
}

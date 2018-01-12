import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Services } from './services.component';
import { routing } from './services.routing';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';


//import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';

import {DataTableModule,SharedModule} from 'primeng/primeng';

import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import {MenuItem} from 'primeng/primeng';            //api

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),GrowlModule,AccordionModule,
    routing
  ],
  declarations: [
    Services
  ],
  providers: [HttpService]
})
export class ServicesModule {}

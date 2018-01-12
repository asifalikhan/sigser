import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';

import { routing } from './batches.routing';
import { Batches } from './batches.component';
import { AllBatches } from './components/allBatches/allBatches.component';
import { EditBatch } from './components/editBatch/editBatch.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { TagInputModule } from 'ngx-chips';
import { Typeahead } from 'ng2-typeahead';

import {FieldsetModule} from 'primeng/primeng';



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
    TagInputModule
  ],
  declarations: [
    Batches,
    AllBatches,
    EditBatch
  ]
})
export class BatchesModule {
}

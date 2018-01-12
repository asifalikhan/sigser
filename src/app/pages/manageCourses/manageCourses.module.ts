import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';

import { routing } from './manageCourses.routing';
import { ManageCourses } from './manageCourses.component';
import { Courses } from './components/courses/courses.component';
import { EditCourse } from './components/editCourse/editCourse.component';
import { ViewCourse } from './components/viewCourse/viewCourse.component';
import { MyCourses } from './components/myCourses/myCourses.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { TagInputModule } from 'ngx-chips';
import { Typeahead } from 'ng2-typeahead';

import {FieldsetModule} from 'primeng/primeng';

import { PdfViewerModule } from 'ng2-pdf-viewer';

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
    TagInputModule,
    PdfViewerModule
  ],
  declarations: [
    ManageCourses,
    Courses,
    EditCourse,
    ViewCourse,
    MyCourses
  ]
})
export class ManageCoursesModule {
}

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Groups } from './groups.component';
import { routing }       from './groups.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { HttpService } from '../../services/http.service';
import {GrowlModule} from 'primeng/primeng';
import { Ng2DragDropModule } from 'ng2-drag-drop';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,Ng2SmartTableModule,
    NgaModule,NgbModule.forRoot(),GrowlModule,
    routing,
    Ng2DragDropModule.forRoot(),
    DragulaModule
  ],
  declarations: [
    Groups
  ],
  providers: [HttpService]
})
export class GroupsModule {}

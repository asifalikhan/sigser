import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Newpassword } from './newpassword.component';
import { routing }       from './newpassword.routing';
import { HttpService } from '../../services/http.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    NgbModule.forRoot(),
    routing
  ],
  declarations: [
    Newpassword
  ],
  providers: [HttpService]
})
export class NewpasswordModule {}

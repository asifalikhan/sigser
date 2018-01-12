import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Resetpassword } from './resetpassword.component';
import { routing }       from './resetpassword.routing';

import { HttpService } from '../../services/http.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    NgbModule.forRoot(),
    routing
  ],
  declarations: [
    Resetpassword
  ],
  providers: [HttpService]
})
export class ResetpasswordModule {}

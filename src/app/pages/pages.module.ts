import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../theme/nga.module';
import { routing }       from './pages.routing';

import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';


import { RtcMultiConnService } from './rtc-multi-conn.service';
import { AudioVideoService } from './rtc-AV.service';
import { UserAuthService } from './user-auth.service';
import { UserService } from './user.service';
@NgModule({
  imports: [CommonModule, AppTranslationModule,NgaModule, routing],
  declarations: [Pages],
  providers : [UserAuthService,UserService,AudioVideoService,RtcMultiConnService]
})
export class PagesModule {
}

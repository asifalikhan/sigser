import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from './file-share.routing';
import { FileshareComponent } from './fileshare.component';
import { SenderComponent } from './chatComponent/senderComponent';
import { ReceiverComponent } from './chatComponent/receiverComponent';
import { UserChatComponent } from './chatComponent/chat-div';
// import { VideoChatComponent } from './chatComponent/videoComponent';
// import { AudioChatComponent } from './chatComponent/audioComponent';
// import { AVmodal } from './chatComponent/modal/modalComponent'; //moved app.module.ts
import { SenderFileComponent } from './chatComponent/senderFileComponent';
import { ReceiverFileComponent } from './chatComponent/receiverFileComponent';

import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {GrowlModule} from 'primeng/primeng';
import { Ng2DragDropModule } from 'ng2-drag-drop';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  imports: [
    routing, 
    FormsModule,
    CommonModule,
    ReactiveFormsModule, NgaModule, NgbModule, GrowlModule,
    Ng2DragDropModule.forRoot(),
    DragulaModule,
  ],
  
  declarations: [
    FileshareComponent, SenderComponent,
    ReceiverComponent, UserChatComponent,
    SenderFileComponent, ReceiverFileComponent,
  ],
  
     entryComponents: [
    SenderComponent, ReceiverComponent,
    UserChatComponent,
    SenderFileComponent, ReceiverFileComponent,
  
  ],
})
export class FileShareModule { }

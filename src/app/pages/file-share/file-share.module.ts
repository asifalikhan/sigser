import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './file-share.routing';
import { FileshareComponent } from './fileshare.component';
import { SenderComponent } from './chatComponent/senderComponent';
import { ReceiverComponent } from './chatComponent/receiverComponent';
import { UserChatComponent } from './chatComponent/chat-div';
// import { VideoChatComponent } from './chatComponent/videoComponent';
// import { AudioChatComponent } from './chatComponent/audioComponent';
//import { AVmodal } from './chatComponent/modal/modalComponent'; //moved app.module.ts

import {GrowlModule} from 'primeng/primeng';

@NgModule({
  imports: [
    routing,
    FormsModule,
    CommonModule,
    GrowlModule,
  ],
  
  declarations: [
    FileshareComponent, SenderComponent,
    ReceiverComponent, UserChatComponent
  ],
  
     entryComponents: [
    SenderComponent, ReceiverComponent,
    UserChatComponent,
  
  ],
})
export class FileShareModule { }


import {
  Component, OnInit, AfterViewInit, ViewChild, ContentChildren,
  ElementRef, Input, ComponentFactoryResolver,
  ComponentFactory, ComponentRef, ViewContainerRef,
  OnDestroy, Output, EventEmitter,
} from '@angular/core';

import { Subject } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { SenderComponent } from './senderComponent';
import { ReceiverComponent } from './receiverComponent';
import { VideoChatComponent } from './videoComponent';
import { AudioChatComponent } from './audioComponent';
import { RtcMultiConnService } from '../../rtc-multi-conn.service';
import { AudioVideoService } from '../../rtc-AV.service';
//import { ScreenAudioService } from '../../rtc-Screen.service';
import { UserAuthService } from '../../user-auth.service';

import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AVmodal } from './modal/modalComponent';


declare let FileSelector: any;

@Component({
  selector: 'chat-component',
  template: `<div class="chat" [hidden]=isShown >
    <div class="chat-header clearfix">
      <img style="height:75px;width:75px" src={{profile_pic_url}}{{img}} alt="avatar" />

      <div class="chat-about">
        <div class="chat-with"> {{name}}</div>
      </div>
      <button #audioBtn title="Audio Call" class="btn btn-info btn-circle btn-lg header-btn" type="button"
       (click)="openAudio()"><i class="fa fa-phone"></i></button>
      
      <button #videoBtn title="Video Call" class="btn btn-info btn-circle btn-lg header-btn" type="button"
       (click)="openVideo()"><i class="fa fa-video-camera"></i></button>
      
      <button #screenBtn title="Share Screen" class="btn btn-info btn-circle btn-lg header-btn" type="button"
       (click)="openScreen()"><i class="fa fa-desktop"></i></button>

    </div>

<div class="chat-fix.width">

  <div #videoAudioDiv class = "chat-history-other" hidden>
  
          <ng-container class = "space-bt-video" #videoAudioPlacedHere>
          </ng-container>
  
      </div>

    <div #chatHistory  class="chat-history">
    
        <ul>
    
            <ng-container #insideUL>
            </ng-container>
    
        </ul>

    </div>
</div>

    <div class="chat-message clearfix">
      <textarea #messageToSend [(ngModel)]=
      "messageToSendContent" (keyup.enter)=
      "render()" name="message-to-send" placeholder="Type your message"
        rows="3"></textarea>

      <i class="fa fa-file-o" (click)="selectFile()"></i> &nbsp;&nbsp;&nbsp;
      <i class="fa fa-file-image-o"></i>

      <button #sendButton (click)="render()">Send</button>

    </div>

  </div>
  `,
  styleUrls: ['../fileshare.component.scss'],
  providers: [HttpService],
})
export class UserChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() img: URL;
  @Input() name: string;
  @Input() emial: string;
  @Input() selectedIndex: number;

  @Input() unReadMsg: number = 0;

  @Input() setActiveModal$: Subject<any>;

  closeResult: string;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
  };
  profile_pic_url:string;
  openVid$: Subject<any> = new Subject();
  openAud$: Subject<any> = new Subject();

  openMainModal$: Subject<any> = new Subject();

  senderInfo: any;


  @ViewChild('insideUL', { read: ViewContainerRef }) elinsideUL;
  @ViewChild('messageToSend') elMessageToSend: ElementRef;
  @ViewChild('chatHistory') elChatHistory: ElementRef;
  @ViewChild('videoAudioDiv') elvideoAudioDiv: ElementRef;
  @ViewChild('videoAudioPlacedHere', { read: ViewContainerRef }) elvideoAudioPlacedHere;
  @ViewChild('audioBtn') elAudioBtn: ElementRef;
  @ViewChild('videoBtn') elVideoBtn: ElementRef;
  @ViewChild('screenBtn') elScreenBtn: ElementRef;


  senderComponentRef: ComponentRef<SenderComponent>;
  receiverComponentRef: ComponentRef<ReceiverComponent>;

  messageToSendContent: any;
  isShown: boolean = true;
  senderContext: any;

  buttonSession: string = '';

  activeModal: any = null;

  private messageResponses: any;


  constructor(protected _HttpService: HttpService,private resolver: ComponentFactoryResolver,
    private userAuthService: UserAuthService,
    private rtc: RtcMultiConnService,
    private rtcAV: AudioVideoService,
    private modalService: NgbModal,
    private elRef: ElementRef) {
    const self = this;

    this.profile_pic_url = this._HttpService.baseURL+'containers/profile_pic/download/';
 

    this.rtcAV.onrequestCallback(function (request) {
      console.log(request);
    });

    this.rtcAV.onCustomMsg(function (message) {
      console.log(message);
    });

  }

  renderReceiverComponent(data) {
    const self = this;
    const fctry: ComponentFactory<ReceiverComponent> = self.resolver.resolveComponentFactory(ReceiverComponent);
    self.receiverComponentRef = self.elinsideUL.createComponent(fctry);
    self.receiverComponentRef.instance.time = data.time;
    self.receiverComponentRef.instance.message = data.message;
    self.receiverComponentRef.instance.name = data.userName;
    self.scrollToBottom();
  }

  getID(): string {
    return this.id;
  }
  toggleView() {
    this.isShown = !this.isShown;
  }
  // pRenderCalled(ev) {
  //   this.pRender.emit(ev.target.value);
  // }

  render() {

    console.info('@#@#@#@343434#@', this.messageToSendContent);
    this.scrollToBottom();
    if (this.messageToSendContent.trim() !== '') {

      if (this.id === 'maingroupComponent') {

        this.senderContext = {
          id: 'maingroupComponent',
          userName: this.senderInfo.name,
          email: '',
          message: this.messageToSendContent,
          time: this.getCurrentTime(),
          sendTo: this.id,
        };
        const factory: ComponentFactory<SenderComponent> = this.resolver.resolveComponentFactory(SenderComponent);
        this.senderComponentRef = this.elinsideUL.createComponent(factory);
        this.senderComponentRef.instance.time = this.senderContext.time;
        this.senderComponentRef.instance.message = this.senderContext.message;
        this.senderComponentRef.instance.name = this.senderContext.userName;

        // this.multiConn.sendText(this.senderContext);
        console.log(this.senderContext);
        this.rtc.sendText(this.senderContext);
        this.scrollToBottom();
        this.messageToSendContent = '';
      } else {

        this.senderContext = {
          id: this.senderInfo.id,
          userName: this.senderInfo.name,
          email: this.senderInfo.email,
          message: this.messageToSendContent,
          time: this.getCurrentTime(),
          sendTo: this.id,
        };

        const factory: ComponentFactory<SenderComponent> = this.resolver.resolveComponentFactory(SenderComponent);
        this.senderComponentRef = this.elinsideUL.createComponent(factory);
        this.senderComponentRef.instance.time = this.senderContext.time;
        this.senderComponentRef.instance.message = this.senderContext.message;
        this.senderComponentRef.instance.name = this.senderContext.userName;

        // this.multiConn.sendText(this.senderContext);
        //////////////////////////
        this.rtc.sendText(this.senderContext);

        // this.rtc.sendCustomMsg(this.senderContext);

        this.scrollToBottom();
        this.messageToSendContent = '';
        console.info('custom msg sent');
      }

      // this.elMessageToSend.nativeElement.value = '';

      // setTimeout(function () {

      //   self.senderComponentRef.destroy();
      //         }, 4000);
      // response goes here....

      // receiverContext = {
      //   response: this.getRandomItem(this.messageResponses),
      //   time: this.getCurrentTime(),
      // };


      // setTimeout(function () {


      // }, 1500);

    }

  }

  selectFile() {
    const self = this;
    const fileSelector = new FileSelector();
    fileSelector.selectSingleFile((file) => {
      self.rtcAV.sendText(file);
    });

  }

  scrollToBottom() {
    try {
      this.elChatHistory.nativeElement.scrollTop = this.elChatHistory.nativeElement.scrollHeight;
    } catch (err) { }
  }
  getCurrentTime() {
    return new Date().toLocaleTimeString().
      replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
  }
  // this will be removed when loopback is ready...
  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  getUserInfo() {
    const userInfo = { id: '', name: '', email: '' };
    userInfo.id = sessionStorage.getItem("user");
    userInfo.name = sessionStorage.getItem("username");
    userInfo.email = sessionStorage.getItem("email");
    this.senderInfo = userInfo;
  }

  openVideo() {
    if (this.activeModal) {
      // show u r already in session.
    } else {

      this.openMainModal$.next({fullName: this.name,
                                userid: this.id});

      // this.activeModal = this.modalService.open(AVmodal, this.ngbModalOptions);
      // this.activeModal.result.subscribe((ibe((ibe((ibe((result) => {
      //   console.info('close with', result);
      //   this.activeModal = null;
      // });
      // // , (reason) => {
      // //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // //   console.log('close result', this.closeResult);
      // // });

      // this.activeModal.componentInstance.modalHeader = `Audio call ${this.name}`;
      //     if (this.buttonSession === '') {
      //   // contorls call for single user or group....
      //   // here

      if (this.id === 'maingroupComponent') {

        //  this.rtcAV.setNoneSession();
             this.rtcAV.setSessionToVideo();
        //    this.rtcAV.audioCallToGroup();
        // this.rtcAV.openOrConnect();
        //       this.rtcAV.checkAndJoin('sdkjlkkjmdi');

        this.rtcAV.videoCallToGroup();
        // this.rtcAV.openRoom(this.senderInfo.id);

        // this.rtcAV.sendCustomMessage({
        //   messageFor: this.id,
        //   message: 'join-for-video',
        //   fullName: this.senderInfo.name,
        //   userid: this.senderInfo.id,
        // });
        

      } else {

        this.rtcAV.getAllParticipent();
        this.rtcAV.setSessionToVideo();
        // this.rtcAV.requestToUser(this.id);
        //        this.rtcAV.checkAndJoin('sdkjlkdfkjmdi');

        this.rtcAV.openRoom2(this.senderInfo.id);

        this.rtcAV.sendCustomMessage({
          messageFor: this.id,
          message: 'join-for-video',
          fullName: this.senderInfo.name,
          userid: this.senderInfo.id,
        });
        this.rtcAV.showRTCobject();
      }

      //   // this.rtcAV.checkAndJoin('sdkjoimmdi');

      //   // if (this.getUserInfo.name === 'asif') {
      //   //   this.rtcAV.openRoom('asfalikhan');
      //   // } else {
      //   //   this.rtcAV.connectRoom('asifalikhan');
      //   // }
    }

    // if (this.buttonSession === '') {
    //   this.elChatHistory.nativeElement.style.height = '150px';
    //   this.elvideoAudioDiv.nativeElement.style.height = '504px';
    //   this.elvideoAudioDiv.nativeElement.hidden = false;

    //   this.elAudioBtn.nativeElement.disabled = true;
    //   this.elScreenBtn.nativeElement.disabled = true;
    //   this.elVideoBtn.nativeElement.style = 'background-color: #ff0024';
    //   this.buttonSession = 'videoOn';

    //   if (this.id === 'maingroupComponent') {
    //      this.rtcAV.setSessionToVideo();
    //     //  this.rtcAV.callToAll();
    //  //   this.rtcAV.videoCallToGroup();
    //  this.rtcAV.checkAndJoin('sdfksdjfkl');
    //   } else {
    //     // this.rtcAV.setNoneSession();
    //     this.rtcAV.videocallToSpecific(this.id);
    //   }

    //   // contorls call for single user or group....
    //   // here


    //   // this.rtcAV.checkAndJoin('sdklkjjmdi');


    //   // if (this.getUserInfo.name === 'asif') {
    //   //   this.rtcAV.openRoom('asfalikhan');
    //   // } else {
    //   //   this.rtcAV.connectRoom('asifalikhan');
    //   // }
    //   //      this.openVid$.next();
    // } else {

    //   this.elChatHistory.nativeElement.style.height = '654px';
    //   this.elvideoAudioDiv.nativeElement.style.height = '0px';
    //   this.elvideoAudioDiv.nativeElement.hidden = true;

    //   this.elAudioBtn.nativeElement.disabled = false;
    //   this.elScreenBtn.nativeElement.disabled = false;
    //   this.elVideoBtn.nativeElement.style = 'background-color: #2eb22c';
    //   this.buttonSession = '';

    //   // if (this.videoComponentsRef) {
    //   //   this.videoComponentsRef.forEach(video => {
    //   //     video.destroy();
    //   //   });
    //   // this.videoComponentsRef = null;

    //   // }

    //   console.info('before remove', this.videoComponentsRef);
    //   // this.rtcAV.stopLocalStreams();
    //   //  this.rtcAV.removeVideoStream();
    //   this.rtcAV.removeAttachStreams();
    //   this.rtcAV.leaveRoom();
    //   console.info('after remove', this.videoComponentsRef);


    //   // this.rtcAV.closeConnection();
    // }


  }

  openAudio() {

    if (this.activeModal) {
      // show u r already in session.
    } else {

      this.openMainModal$.next({fullName: this.name,
                                userid: this.id});

      // this.activeModal = this.modalService.open(AVmodal, this.ngbModalOptions);
      // this.activeModal.result.subscribe((ibe((ibe((ibe((result) => {
      //   console.info('close with', result);
      //   this.activeModal = null;
      // });
      // // , (reason) => {
      // //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // //   console.log('close result', this.closeResult);
      // // });

      // this.activeModal.componentInstance.modalHeader = `Audio call ${this.name}`;
      //     if (this.buttonSession === '') {
      //   // contorls call for single user or group....
      //   // here

      if (this.id === 'maingroupComponent') {

        //  this.rtcAV.setNoneSession();
             this.rtcAV.setSessionToAudio();
        //    this.rtcAV.audioCallToGroup();
        // this.rtcAV.openOrConnect();
        //       this.rtcAV.checkAndJoin('sdkjlkkjmdi');
    this.rtcAV.audioCallToGroup();

        //    this.rtcAV.openRoom(this.senderInfo.id);

        // this.rtcAV.sendCustomMessage({
        //   messageFor: this.id,
        //   message: 'join-for-audio',
        //   fullName: this.senderInfo.name,
        //   userid: this.senderInfo.id,
        // });
        

      } else {

        this.rtcAV.getAllParticipent();
        this.rtcAV.setSessionToAudio();
        // this.rtcAV.requestToUser(this.id);
        //        this.rtcAV.checkAndJoin('sdkjlkdfkjmdi');

        this.rtcAV.openRoom2(this.senderInfo.id);

        this.rtcAV.sendCustomMessage({
          messageFor: this.id,
          message: 'join-for-audio',
          fullName: this.senderInfo.name,
          userid: this.senderInfo.id,
        });
        this.rtcAV.showRTCobject();
      }

      //   // this.rtcAV.checkAndJoin('sdkjoimmdi');

      //   // if (this.getUserInfo.name === 'asif') {
      //   //   this.rtcAV.openRoom('asfalikhan');
      //   // } else {
      //   //   this.rtcAV.connectRoom('asifalikhan');
      //   // }
    }

    // if (this.buttonSession === '') {
    //   this.elChatHistory.nativeElement.style.height = '150px';
    //   this.elvideoAudioDiv.nativeElement.style.height = '504px';
    //   this.elvideoAudioDiv.nativeElement.hidden = false;


    //   this.elScreenBtn.nativeElement.disabled = true;
    //   this.elVideoBtn.nativeElement.disabled = true;
    //   this.elAudioBtn.nativeElement.style = 'background-color: #ff0024';
    //   this.buttonSession = 'audioOn';
    //   // contorls call for single user or group....
    //   // here

    //   if (this.id === 'maingroupComponent') {

    //   //  this.rtcAV.setNoneSession();
    //   this.rtcAV.setSessionToAudio();
    //   //    this.rtcAV.audioCallToGroup();
    //    // this.rtcAV.openOrConnect();
    //    this.rtcAV.checkAndJoin('sdkjlkkjmdi');


    //   } else {
    //     // this.rtcAV.sendText({
    //     //   type: 'audio-request',
    //     //   senderInfo: this.senderInfo,
    //     // });

    //     this.rtcAV.getAllParticipent();
    //     //     this.rtcAV.setSessionToAudio();
    //     // this.rtcAV.requestToUser(this.id);

    //     //  this.rtcAV.audioCallToSpecific(this.id);
    //     this.rtcAV.sendCustomMessage({
    //       messageFor: this.id,
    //       message: 'join-for-video',
    //       fullName: this.userAuthService.getCurrentUser().name,
    //       userid: this.userAuthService.getCurrentUser().id,
    //     });
    //     this.rtcAV.showRTCobject();
    //   }

    //   // this.rtcAV.checkAndJoin('sdkjoimmdi');

    //   // if (this.getUserInfo.name === 'asif') {
    //   //   this.rtcAV.openRoom('asfalikhan');
    //   // } else {
    //   //   this.rtcAV.connectRoom('asifalikhan');
    //   // }
    //   //   this.openVid$.next();
    // } else {

    //   this.elChatHistory.nativeElement.style.height = '654px';
    //   this.elvideoAudioDiv.nativeElement.style.height = '0px';
    //   this.elvideoAudioDiv.nativeElement.hidden = true;

    //   this.elScreenBtn.nativeElement.disabled = false;
    //   this.elVideoBtn.nativeElement.disabled = false;
    //   this.elAudioBtn.nativeElement.style = 'background-color: #2eb22c';
    //   this.buttonSession = '';

    //   console.info('before remove', this.audioComponentsRef);
    //   // this.rtcAV.stopAllStreams();
    //   this.rtcAV.removeAttachStreams();
    //   // this.rtcAV.leaveRoom();
    //   console.info('after remove', this.audioComponentsRef);
    //   // this.rtcAV.closeConnection();

    // }


    //   this.openAud$.next();
  }

  openScreen() {

    if (this.activeModal) {
      // show u r already in session.
    } else {

      this.openMainModal$.next({fullName: this.name,
                                userid: this.id});

      // this.activeModal = this.modalService.open(AVmodal, this.ngbModalOptions);
      // this.activeModal.result.subscribe((ibe((ibe((ibe((result) => {
      //   console.info('close with', result);
      //   this.activeModal = null;
      // });
      // // , (reason) => {
      // //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // //   console.log('close result', this.closeResult);
      // // });

      // this.activeModal.componentInstance.modalHeader = `Audio call ${this.name}`;
      //     if (this.buttonSession === '') {
      //   // contorls call for single user or group....
      //   // here

      if (this.id === 'maingroupComponent') {

        //  this.rtcAV.setNoneSession();
             this.rtcAV.setSessionToScreenAudio();
        //    this.rtcAV.audioCallToGroup();
        // this.rtcAV.openOrConnect();
        //       this.rtcAV.checkAndJoin('sdkjlkkjmdi');
//        this.rtcAV.openRoom(this.senderInfo.id);
        this.rtcAV.shareScreenToGroup();
        // this.rtcAV.sendCustomMessage({
        //   messageFor: this.id,
        //   message: 'join-for-screen',
        //   fullName: this.senderInfo.name,
        //   userid: this.senderInfo.id,
        // });
        

      } else {

        this.rtcAV.getAllParticipent();
        this.rtcAV.setSessionToScreenAudio();
        // this.rtcAV.requestToUser(this.id);
        //        this.rtcAV.checkAndJoin('sdkjlkdfkjmdi');

        this.rtcAV.openRoom2(this.senderInfo.id);

        this.rtcAV.sendCustomMessage({
          messageFor: this.id,
          message: 'join-for-screen',
          fullName: this.senderInfo.name,
          userid: this.senderInfo.id,
        });
        this.rtcAV.showRTCobject();
      }

      //   // this.rtcAV.checkAndJoin('sdkjoimmdi');

      //   // if (this.getUserInfo.name === 'asif') {
      //   //   this.rtcAV.openRoom('asfalikhan');
      //   // } else {
      //   //   this.rtcAV.connectRoom('asifalikhan');
      //   // }
    }




    // if (this.buttonSession === '') {
    //   this.elChatHistory.nativeElement.style.height = '150px';
    //   this.elvideoAudioDiv.nativeElement.style.height = '504px';
    //   this.elvideoAudioDiv.nativeElement.hidden = false;


    //   this.elVideoBtn.nativeElement.disabled = true;
    //   this.elAudioBtn.nativeElement.disabled = true;
    //   this.elScreenBtn.nativeElement.style = 'background-color: #ff0024';
    //   this.buttonSession = 'ScreenOn';
    //   // contorls call for single user or group....
    //   // here

    //   this.rtcAV.setSessionToScreenAudio();
    //   this.rtcAV.checkAndJoin('sdkkjkjmmdi');

    //   // if (this.getUserInfo.name === 'asif') {
    //   //   this.rtcAV.openRoom('asfalikhan');
    //   // } else {
    //   //   this.rtcAV.connectRoom('asifalikhan');
    //   // }
    //   //      this.openVid$.next();
    // } else {

    //   this.elChatHistory.nativeElement.style.height = '654px';
    //   this.elvideoAudioDiv.nativeElement.style.height = '0px';
    //   this.elvideoAudioDiv.nativeElement.hidden = true;

    //   this.elVideoBtn.nativeElement.disabled = false;
    //   this.elAudioBtn.nativeElement.disabled = false;
    //   this.elScreenBtn.nativeElement.style = 'background-color: #2eb22c';
    //   this.buttonSession = '';

    //   console.info('before remove', this.videoComponentsRef, this.audioComponentsRef);
    //   // this.rtcAV.stopAllStreams();
    //   this.rtcScreen.removeAttachStreams();
    //   // this.rtcScreen.leaveRoom();
    //   console.info('after remove', this.videoComponentsRef, this.audioComponentsRef);
    //   // this.rtcAV.closeConnection();
    // }


    //   this.openAud$.next();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    const self = this;

    this.getUserInfo();

    this.setActiveModal$.subscribe((modal) => {
      console.info('modal captured ', modal);
      this.activeModal = modal;
    });

    // if (this.name === 'numan') {
    //   this.rtcAV.openRoom();
    // } else {
    //   this.rtcAV.openOrConnect();
    // }


    // this.rtcAV.openRoomForUser(this.id);

    // console.log(this.multiConn);

    // this.rtc.checkAndJoin('asifRoom34');


  }

  ngOnDestroy() {
    if (this.senderComponentRef) {
      this.senderComponentRef.destroy();
    }
    if (this.receiverComponentRef) {
      this.receiverComponentRef.destroy();
    }
    // this.multiConn.close();
  }
}

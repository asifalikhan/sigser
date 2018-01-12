
import {
  Component, OnInit, AfterViewInit, ViewChild, ContentChildren,
  ElementRef, Input, ComponentFactoryResolver,
  ComponentFactory, ComponentRef, ViewContainerRef,
  OnDestroy, Output, EventEmitter,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SenderComponent } from './senderComponent';
import { ReceiverComponent } from './receiverComponent';
import { VideoChatComponent } from './videoComponent';
import { AudioChatComponent } from './audioComponent';
import { RtcMultiConnService } from '../../rtc-multi-conn.service';
import { AudioVideoService } from '../../rtc-AV.service';
import { UserAuthService } from '../../user-auth.service';
import { SenderFileComponent } from './senderFileComponent';
import { ReceiverFileComponent } from './receiverFileComponent';

import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AVmodal } from './modal/modalComponent';

import { HttpService } from '../../../services/http.service';

declare let FileSelector: any;

@Component({
  selector: 'chat-component',
templateUrl: './chat-div.html',
  styleUrls: ['../fileshare.component.scss'],
  providers: [HttpService],
})
export class UserChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() img: string;
  @Input() name: string;
  @Input() email: string; 
  @Input() selectedIndex: number;
  @Input() groupUsers = [];
  @Input() type: string;

  @Input() unReadMsg: number = 0;

  @Input() setActiveModal$: Subject<any>;

  //////////////////////ng model ////////////////////////////

  closeResult: string;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
  };
  //////////////////////////////////////////////////////////////////////////

  // @Output() openVid = new EventEmitter<any>();
  // @Output() openAud = new EventEmitter<any>();

  openVid$: Subject<any> = new Subject();
  openAud$: Subject<any> = new Subject();

  openMainModal$: Subject<any> = new Subject();

  senderInfo: any;


  // @Input() status: boolean;
  // @Output() pRender: EventEmitter<string> = new EventEmitter();

  @ViewChild('insideUL', { read: ViewContainerRef }) elinsideUL;
  @ViewChild('messageToSend') elMessageToSend: ElementRef;
  @ViewChild('chatHistory') elChatHistory: ElementRef;
  @ViewChild('videoAudioDiv') elvideoAudioDiv: ElementRef;
  @ViewChild('videoAudioPlacedHere', { read: ViewContainerRef }) elvideoAudioPlacedHere;
  @ViewChild('audioBtn') elAudioBtn: ElementRef;
  @ViewChild('videoBtn') elVideoBtn: ElementRef;
  @ViewChild('screenBtn') elScreenBtn: ElementRef;
  @ViewChild('joinSessionBtn') eljoinSessionBtn: ElementRef;


  senderComponentRef: ComponentRef<SenderComponent>;
  receiverComponentRef: ComponentRef<ReceiverComponent>;
  senderFileComponentRef: ComponentRef<SenderFileComponent>;
  receiverFileComponentRef: ComponentRef<ReceiverFileComponent>;

  messageToSendContent: any;
  isShown: boolean = true;
  senderContext: any;

  buttonSession: string = '';

  activeModal: any = null;

  currentSession: any;

  roomName:string;//'asif59cd0a9f0d';
  // receiverContext: any;

  // rtcStream: any;
isInitiator: boolean;

  private messageResponses: any;


  constructor(private _HttpService: HttpService, private resolver: ComponentFactoryResolver,
    private userAuthService: UserAuthService,
    private rtc: RtcMultiConnService,
    private rtcAV: AudioVideoService,
    private modalService: NgbModal,
    private elRef: ElementRef) {
    const self = this;



    $(document).ready(function () {
      console.log('jquery is ready in chat div');
      
    });



    // this.rtcAV.onNewSessionCallBack(function (session) {
    //   console.info('session received vola!!!');
    //   session.join();
    //   console.info('user id', session.userid);
    //   console.info('session id', session.sessionid);
    //   console.info('session ', session.session);
    //   console.info('session extra', session.extra);
    // });


    this.rtcAV.onrequestCallback(function (request) {
      console.log(request);
    });

    this.rtcAV.onCustomMsg(function (message) {
      console.log(message);
    });


    this.roomName = sessionStorage.getItem("roomName");
    console.log("roomName:" , this.roomName);

   // this.roomName = 'audioVideoOnly';

    ////////////////////////////////////////////////

/*     this.rtcScreen.onUserStatus(function (event) {
      console.info('on user status changed ', event);
      console.log('ON USERstatusChanged ', event.userid, 'gonna ', event.status);

      // setTimeout(function () {
      //   self.rtcScreen.getUserInternalStream(event.userid);
      // }, 1000);

    }); */


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

  renderReceiverFileComponent(data) {
    const self = this;
    const fctry: ComponentFactory<ReceiverFileComponent> = self.resolver.resolveComponentFactory(ReceiverFileComponent);
    self.receiverFileComponentRef = self.elinsideUL.createComponent(fctry);
    self.receiverFileComponentRef.instance.time = data.time;
    self.receiverFileComponentRef.instance.file = data.message;
    self.receiverFileComponentRef.instance.name = data.userName;
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

      if (this.type === 'group') {

        this.senderContext = {
          id: this.id,
          userName: this.senderInfo.name,
          email: '',
          messageType: 'text',
          message: this.messageToSendContent,
          time: this.getCurrentTime(),
          sendTo: this.id,
        };
        const factory: ComponentFactory<SenderComponent> = this.resolver.resolveComponentFactory(SenderComponent);
        this.senderComponentRef = this.elinsideUL.createComponent(factory);
        this.senderComponentRef.instance.time = this.senderContext.time;
        this.senderComponentRef.instance.message = this.senderContext.message;
        this.senderComponentRef.instance.name = this.senderContext.userName;
        let messages:any;
        // this.multiConn.sendText(this.senderContext);
        this._HttpService.getData("GroupChats/"+sessionStorage.getItem("groupChatId")).subscribe((data)=>{
          messages  = data.messages;
          // messages.push({
          //   "userName":sessionStorage.getItem("username"),
          //   "time":this.senderContext.time,
          //   "message":this.senderContext.message
          // });
          messages.push({data: this.senderContext});
          this._HttpService.patchData("GroupChats/"+sessionStorage.getItem("groupChatId"),{"messages":messages});
        });

        

        this.rtc.sendText(this.senderContext);
        this.scrollToBottom();
        this.messageToSendContent = '';
      } else {

        this.senderContext = {
          id: this.senderInfo.id,
          userName: this.senderInfo.name,
          email: this.senderInfo.email,
          messageType: 'text',
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

    }

  }

  selectFile() {
    const self = this;
    const fileSelector = new FileSelector();
    fileSelector.selectSingleFile((file) => {
      if (file) {
        if (this.type === 'group') {

          this.senderContext = {
            id: this.id,
            userName: this.senderInfo.name,
            email: '',
            messageType: 'file',
            // message: file,
            time: this.getCurrentTime(),
            sendTo: this.id,
          };

          file.extra = this.senderContext;

          const factory: ComponentFactory<SenderFileComponent> =
            this.resolver.resolveComponentFactory(SenderFileComponent);
          this.senderFileComponentRef = this.elinsideUL.createComponent(factory);
          this.senderFileComponentRef.instance.time = this.senderContext.time;
          this.senderFileComponentRef.instance.file = file;

          this.senderFileComponentRef.instance.name = this.senderContext.userName;

          // this.multiConn.sendText(this.senderContext);

          this.rtc.sendText(file);
          this.scrollToBottom();
          this.messageToSendContent = '';
        } else {

          this.senderContext = {
            id: this.senderInfo.id,
            userName: this.senderInfo.name,
            email: this.senderInfo.email,
            messageType: 'file',
            // message: file,
            time: this.getCurrentTime(),
            sendTo: this.id,
          };

          file.extra = this.senderContext;

          const factory: ComponentFactory<SenderFileComponent> =
            this.resolver.resolveComponentFactory(SenderFileComponent);
          this.senderFileComponentRef = this.elinsideUL.createComponent(factory);
          this.senderFileComponentRef.instance.time = this.senderContext.time;
          this.senderFileComponentRef.instance.file = file;
          this.senderFileComponentRef.instance.name = this.senderContext.userName;

          // this.multiConn.sendText(this.senderContext);
          //////////////////////////
          this.rtc.sendText(file);

          // this.rtc.sendCustomMsg(this.senderContext);

          this.scrollToBottom();
          this.messageToSendContent = '';
          console.info('custom file sent');
        }
      }
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
    //  userInfo.id = this.userAuthService.getCurrentUser().id;
    userInfo.id = this.rtcAV.audioVideoConnection.userid;
    userInfo.name = sessionStorage.getItem("username");
    userInfo.email = sessionStorage.getItem("email");
    this.senderInfo = userInfo;
  }

  openVideo() {
    if (this.activeModal) {
      // show u r already in session.
      console.error('u r already in session please close that before');
    } else {

      this.openMainModal$.next({
        fullName: this.name, 
        userid: this.id,
      });
      this.activeModal.componentInstance.emitCurrentSession.subscribe((session) => {
        this.currentSession = session;
      });


      if (this.type === 'group') {

        if (this.currentSession) {
          // do nothing .....
        } else {
          if (sessionStorage.getItem("userType")  === 'instructor') {
            this.rtcAV.setSessionToVideo();
            this.rtcAV.openRoom2(this.roomName);

            this.rtcAV.sendCustomMessage({
              messageFor: this.id,
              messageFrom: this.rtcAV.audioVideoConnection.userid,
              message: 'join-for-video',
              fullName: this.senderInfo.name,
              userid: this.roomName,
            });
            this.rtcAV.audioVideoConnection.isInitiator = true;
            this.rtcAV.audioVideoConnection.autoCloseEntireSession = true;

          } else {
            this.rtcAV.setSessionToVideo();
            this.rtcAV.joinRoom(this.roomName);
          }
        }

        //  this.rtcAV.setNoneSession();
     
        //    this.rtcAV.audioCallToGroup();
        // this.rtcAV.openOrConnect();
        //       this.rtcAV.checkAndJoin('sdkjlkkjmdi');



      } else {

        if (this.currentSession) {
          // do nothing just load existing streams
        } else {
          this.rtcAV.setSessionToVideo();
          this.rtcAV.openRoom2(/* this.senderInfo.id +  */this.senderInfo.id);
          this.rtcAV.audioVideoConnection.isInitiator = true;
          this.rtcAV.audioVideoConnection.autoCloseEntireSession = true;
          

          this.rtcAV.sendCustomMessage({
            messageFor: this.id,
            messageFrom: this.rtcAV.audioVideoConnection.userid,
            message: 'join-for-video',
            fullName: this.senderInfo.name,
            userid: /* this.senderInfo.id +  */this.senderInfo.id,
          });

        }

        this.rtcAV.getAllParticipent();

        this.rtcAV.showRTCobject();
      }

      //   // this.rtcAV.checkAndJoin('sdkjoimmdi');

      //   // if (this.getUserInfo.name === 'asif') {
      //   //   this.rtcAV.openRoom('asfalikhan');
      //   // } else {
      //   //   this.rtcAV.connectRoom('asifalikhan');
      //   // }
    }

  }

  openAudio() {

    if (this.activeModal) {
      // show u r already in session.
      console.error('u r already in session please close that before');
    } else {

      this.openMainModal$.next({
        fullName: this.name,
        userid: this.id,
      });
      this.activeModal.componentInstance.emitCurrentSession.subscribe((session) => {
        this.currentSession = session;
      });

      console.log("@@@ all info", this.roomName, this.id, sessionStorage.getItem("userType"));

      if (this.type === 'group') {


        if (this.currentSession) {
          // do nothing load exist session
        } else {
          if (sessionStorage.getItem("userType") === 'instructor') {

            this.rtcAV.setSessionToAudio();
            // this.rtcAV.requestToUser(this.id);
            //        this.rtcAV.checkAndJoin('sdkjlkdfkjmdi');

            this.rtcAV.openRoom2(this.roomName);
            console.log('opening room: ', this.roomName);
            this.rtcAV.sendCustomMessage({
              messageFor: this.id,
              messageFrom: this.rtcAV.audioVideoConnection.userid,
              message: 'join-for-audio',
              fullName: this.senderInfo.name,
              userid: this.roomName,
            });



            // this.rtcAV.setSessionToAudio();
            // this.rtcAV.openRoom2(this.roomName);
            this.rtcAV.audioVideoConnection.isInitiator = true;
            this.rtcAV.audioVideoConnection.autoCloseEntireSession = true;
            

          } else {
            this.rtcAV.setSessionToAudio();
            this.rtcAV.joinRoom(this.roomName);
          }
          // this.rtcAV.audioCallToGroup();
        }

        //  this.rtcAV.setNoneSession();

        // this.rtcAV.openOrConnect();
        //       this.rtcAV.checkAndJoin('sdkjlkkjmdi');


        //    this.rtcAV.openRoom(this.senderInfo.id);

        // this.rtcAV.sendCustomMessage({
        //   messageFor: this.id,
        //   message: 'join-for-audio',
        //   fullName: this.senderInfo.name,
        //   userid: this.senderInfo.id,
        // });


      } else {

        if (this.currentSession) {
          // do nothing load existing straems
        } else {
          this.rtcAV.setSessionToAudio();
          // this.rtcAV.requestToUser(this.id);
          //        this.rtcAV.checkAndJoin('sdkjlkdfkjmdi');

          this.rtcAV.openRoom2(/* this.senderInfo.id +  */this.senderInfo.id);
          console.log('opening room: ', this.senderInfo.id);
          this.rtcAV.audioVideoConnection.isInitiator = true;
          this.rtcAV.audioVideoConnection.autoCloseEntireSession = true;
          
          this.rtcAV.sendCustomMessage({
            messageFor: this.id,
            messageFrom: this.rtcAV.audioVideoConnection.userid,
            message: 'join-for-audio',
            fullName: this.senderInfo.name,
            userid: /* this.senderInfo.id +  */this.senderInfo.id,
          });
        }

        this.rtcAV.getAllParticipent();

        this.rtcAV.showRTCobject();
      }

      // this.rtcAV.checkAndJoin('sdkjoimmdi');

      // if (this.getUserInfo.name === 'asif') {
      //   this.rtcAV.openRoom('asfalikhan');
      // } else {
      //   this.rtcAV.connectRoom('asifalikhan');
      // }
    }

  }

  openScreen() {

    if (this.activeModal) {
      // show u r already in session.
      console.error('u r already in session please close that before');
    } else {

      this.openMainModal$.next({
        fullName: this.name,
        userid: this.id,
      });
      this.activeModal.componentInstance.emitCurrentSession.subscribe((session) => {
        this.currentSession = session;
      });


      if (this.type === 'group') {

        if (this.currentSession) {
          // do nothing .......
        } else {
          if (sessionStorage.getItem("userType") === 'instructor') {
            this.rtcAV.setSessionToScreenAudio();
            this.rtcAV.openRoom2(this.roomName);

            this.rtcAV.sendCustomMessage({
              messageFor: this.id,
              messageFrom: this.rtcAV.audioVideoConnection.userid,
              message: 'join-for-screen',
              fullName: this.senderInfo.name,
              userid: this.roomName,
            });
            this.rtcAV.audioVideoConnection.isInitiator = true;
            this.rtcAV.audioVideoConnection.autoCloseEntireSession = true;
            
          } else {
            this.rtcAV.setSessionToScreenAudio();
            this.rtcAV.joinRoom(this.roomName);
          }
        }

        //  this.rtcAV.setNoneSession();
       
        //    this.rtcAV.audioCallToGroup();
        // this.rtcAV.openOrConnect();
        //       this.rtcAV.checkAndJoin('sdkjlkkjmdi');
       
     //   this.rtcAV.shareScreenToGroup();
        // this.rtcAV.sendCustomMessage({
        //   messageFor: this.id,
        //   message: 'join-for-screen',
        //   fullName: this.senderInfo.name,
        //   userid: this.senderInfo.id,
        // });


      } else {

        if (this.currentSession) {
          // do nothing load existing streams ....
        } else {
          this.rtcAV.setSessionToScreenAudio();
          this.rtcAV.openRoom2(/* this.senderInfo.id +  */this.senderInfo.id);
          console.log('opening room: ', this.senderInfo.id);
          this.rtcAV.audioVideoConnection.isInitiator = true;
          this.rtcAV.audioVideoConnection.autoCloseEntireSession = true;

          this.rtcAV.sendCustomMessage({
            messageFor: this.id,
            messageFrom: this.rtcAV.audioVideoConnection.userid,
            message: 'join-for-screen',
            fullName: this.senderInfo.name,
            userid: /* this.senderInfo.id +  */this.senderInfo.id,
          });
        }

        this.rtcAV.getAllParticipent();

        this.rtcAV.showRTCobject();
      }

      //   // this.rtcAV.checkAndJoin('sdkjoimmdi');

      //   // if (this.getUserInfo.name === 'asif') {
      //   //   this.rtcAV.openRoom('asfalikhan');
      //   // } else {
      //   //   this.rtcAV.connectRoom('asifalikhan');
      //   // }
    }

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

  setSessionButton() {

    if (!this.isInitiator && this.id === 'maingroupComponent') {
      this.rtcAV.checkRoomPresence(this.roomName, function(roomExist){
        console.log("room exist.... ", roomExist);
        if(roomExist) {
          this.eljoinSessionBtn.nativeElement.disabled = false;
          this.eljoinSessionBtn.nativeElement.title = 'join session';
        } else {
          this.eljoinSessionBtn.nativeElement.disabled = true;
          this.eljoinSessionBtn.nativeElement.title = 'no session';
        }

      }.bind(this));

    }
  }
 

  joinSession() {

   // this.rtcAV.setSessionToAudio();
    this.openMainModal$.next({
      fullName: this.name,
      userid: this.id, 
    });
    this.rtcAV.joinRoom(this.roomName);
    console.log('joining room: ', this.roomName);
 
  }

  ngOnInit() {
    this.isInitiator = sessionStorage.getItem('userType') === 'instructor'? true: false;
  }

  ngAfterViewInit() {

    const self = this;

    this.getUserInfo();

    this.setActiveModal$.subscribe((modal) => {
      console.info('modal captured ', modal);
      this.activeModal = modal;
    });

    this.setSessionButton();

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
import {
  Component, OnInit, AfterViewInit, ViewChild,
  ElementRef, Input, ComponentFactoryResolver,
  ComponentFactory, ComponentRef, ViewContainerRef,
  OnDestroy, Injectable
} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';

import { UserAuthService } from '../user-auth.service';
import { UserService } from '../user.service';
import { dummyusers } from './dummyusers';
import { UserChatComponent } from './chatComponent/chat-div';
import { RtcMultiConnService } from '../rtc-multi-conn.service';
import { ReceiverComponent } from './chatComponent/receiverComponent';
import { AudioVideoService } from '../rtc-AV.service';
import { RequestModal } from './chatComponent/requestModal/rModal.component';
import { AVmodal } from './chatComponent/modal/modalComponent';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2DragDropModule } from 'ng2-drag-drop';

import { AlertService } from '../../services/alert.service';
import { Message } from 'primeng/primeng';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

declare let getHTMLMediaElement: any;

declare let List: any;
declare let fuzzysearch: any;

import { HttpService } from '../../services/http.service';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

import { Routes, Router, ActivatedRoute } from '@angular/router';


const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


/// @@@@@@@@@@@@@ file share component.............
@Component({
  selector: 'app-fileshare',
  templateUrl: './fileshare.component.html',
  styleUrls: ['./fileshare.component.scss'],
  providers: [HttpService, AlertService],
})
export class FileshareComponent implements OnInit, AfterViewInit {

  public groupsForm: FormGroup;





  msgs: Message[] = [];

  fuzzySearchBinding: any;
  userList: any;
  userToPopulate = [];
  zIndex: any = 0;
  selectedIndex: number;
  isFriendsAvailable: boolean;

  mainView: boolean = true;
  manageGroupView: boolean = false;
  createGroupView: boolean = false;
  currentUserFriends = [];
  currentUserFriendsSecond = [];
  newGroupUsers = [];
  groupName: any;
  groups = [];
  isGroupUpdated: boolean = false;
  groupRefToBeUpdate: any;
  searchPeopleView: boolean = false;
  model: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  urlForINQ: string;
  currentLogedInUser: any;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
  };

  requestModal: any = null;
  activeModal: any = null;
  activeModalSetter$: Subject<any> = new Subject();

  chatComponentsRef: ComponentRef<UserChatComponent>[] = [];
  activeComponentRef: ComponentRef<UserChatComponent> = null;
  mainGroupComponentRef: ComponentRef<UserChatComponent>;

  pendingMessages = [];

  remoteStreamsIds = [];

  // groupInfo = { id: 'maingroupComponent', firstName: 'Class Room', lastName: '', profile_pic: 'group.jpg' };

  // @ViewChild('sendButton') elSendButton: ElementRef;
  // @ViewChild('chatUL', { read: ViewContainerRef }) elChatUl;
  @ViewChild('userListHTML') eluserListHTML: ElementRef;
  @ViewChild('dynamicChatDiv', { read: ViewContainerRef }) eldynamicChatDiv;
  @ViewChild('videoDiv') elvideoDiv: ElementRef;
  @ViewChild('MessageTone') elMessageTone: ElementRef;

  @ViewChild('callTone') elcallTone: ElementRef;
  @ViewChild('typeheadtemplate') eltypeaheadTemplate: ElementRef;

  currentSession: any;

  roomName: string;

  profile_pic_url: string;

  constructor(public route: ActivatedRoute, public router: Router, protected _HttpService: HttpService, private _menuService: BaMenuService, private resolver: ComponentFactoryResolver,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private rtc: RtcMultiConnService,
    private elRef: ElementRef,
    private rtcAV: AudioVideoService,
    private modalService: NgbModal,
    private groupsFb: FormBuilder,
    protected _alert: AlertService) {

    this.groupsForm = groupsFb.group({
      'groupName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });
    this.groupName = this.groupsForm.controls['groupName'];

    this.profile_pic_url = this._HttpService.baseURL + 'containers/profile_pic/download/';
    const self = this;
    this.getUserFriends();

    this.rtcAV.connectToCustomSocket(function (socket) {
      socket.on(self.rtcAV.audioVideoConnection.socketCustomEvent, function (event) {
        console.log("event: ", event);

        if (event.message === 'update-session-btn') {
          if (this.activeComponentRef) {
            this.activeComponentRef.instance.setSessionButton();
          }
        }

        if (event.message === 'running-session') {
          if (event.session === 'audio') {
            this.rtcAV.setSessionToAudio();
          }
          else if (event.session === 'video') {
            this.rtcAV.setSessionToVideo();
          }
          else if (event.session === 'screen') {
            this.rtcAV.setSessionToScreenAudio();
          }
          else if (event.session === 'none') {
            //this.rtcAV.setSessionToNone();
          }
        }

        // check if someone sent you a custom message
        console.log('custom socket event is fired', event.messageFor, self.rtcAV.audioVideoConnection.userid);
        if (event.messageFor === self.rtcAV.audioVideoConnection.userid ||
          self.checkIfGroupExist(event.messageFor)) {
          // this custom message is for me

          // this.activeComponentRef.instance.setSessionButton();

          // check if someone requested for video chat
          if (event.message === 'join-for-audio') {
            self.rtcAV.setSessionToAudio();

            self.requestModal = self.modalService.open(RequestModal, self.ngbModalOptions);
            self.requestModal.componentInstance.requestType = `Audio Call From ${event.fullName}`;
            self.requestModal.componentInstance.requestBody =
              `${event.fullName} want to start audio chat with you. Do you accept?`;
            self.palyCallTone();
            this.userToPopulate.forEach((user) => {
              if (event.messageFrom === user.id) {
                self.requestModal.componentInstance.img = this.profile_pic_url + user.profile_pic;
                self.requestModal.componentInstance.name = user.firstName;
                console.log(user);
                console.log(self.requestModal.componentInstance.img);
              }
            });
            self.requestModal.result.then((result) => {
              console.info('close with', result);
              if (result === 'accept') {
                self.stopCallTone();

                // self.rtcAV.setSessionToAudio();
                self.openMainModal(event);
                self.rtcAV.joinRoom(event.userid);
                console.log('joining room: ', event.userid);

              } else if (result === 'deny') {
                self.stopCallTone();
                // inform caller about denying 
              } else {
                // if user click on cross 
                // do some think else
              }

              self.requestModal = null;
            });
          }

          // check if someone requested for text chat
          if (event.message === 'join-for-video') {

            self.rtcAV.setSessionToVideo();

            self.requestModal = self.modalService.open(RequestModal, self.ngbModalOptions);
            self.requestModal.componentInstance.requestType = `Video Call From ${event.fullName}`;
            self.requestModal.componentInstance.requestBody =
              `${event.fullName} want to start video chat with you. Do you accept?`;

            self.requestModal.result.then((result) => {
              console.info('close with', result);
              if (result === 'accept') {

                // self.rtcAV.setSessionToVideo();
                self.openMainModal(event);
                self.rtcAV.joinRoom(event.userid);

              } else if (result === 'deny') {
                // inform caller about denying 
              } else {
                // if user click on cross 
                // do some think else
              }

              self.requestModal = null;
            });

          }

          if (event.message === 'join-for-screen') {

            self.rtcAV.setSessionToScreenAudio();

            self.requestModal = self.modalService.open(RequestModal, self.ngbModalOptions);
            self.requestModal.componentInstance.requestType = `${event.fullName} share screen with you.`;
            self.requestModal.componentInstance.requestBody =
              `${event.fullName} share screen with you. Do you accept?`;

            self.requestModal.result.then((result) => {
              console.info('close with', result);
              if (result === 'accept') {
                //  self.rtcAV.setSessionToScreenAudio();
                self.openMainModal(event);
                self.rtcAV.joinRoom(event.userid);

              } else if (result === 'deny') {
                // inform caller about denying 
              } else {
                // if user click on cross 
                // do some think else
              }

              self.requestModal = null;
            });
          }

        }
      }.bind(this));
    }.bind(this));




    this.rtcAV.onMediaErrorCallback(function (err) {

      console.log(err);

    });


    this.rtcAV.onStreamCallBack(function (event) {
      console.info('event is coming ', event, this.activeModal);

      let exist: boolean = false;
      self.remoteStreamsIds.forEach(id => {
        if (id === event.streamid) {
          exist = true;
        }
      });
      if (!exist) {
        self.remoteStreamsIds.push(event.streamid);
      }

      /// get this extra.id from database. this id is used to ensure only instructor can call in group.
      if (self.activeModal === null && event.stream.isScreen && event.extra.id === 'teacher-123') {
        self.requestModal = self.modalService.open(RequestModal, self.ngbModalOptions);
        self.requestModal.componentInstance.requestType = `${event.extra.name} share screen with main group.`;
        self.requestModal.componentInstance.requestBody =
          `${event.extra.name} share screen with main group. Do you like to join?`;


        self.requestModal.result.then((result) => {
          console.info('close with', result);
          if (result === 'accept') {
            //   self.rtcAV.setSessionToScreenAudio();
            self.openMainModal({
              fullName: event.extra.name,
              userid: event.extra.id,
            });
            self.activeModal.componentInstance.addStream(event);

            self.rtcAV.audioCallToGroup();

          } else if (result === 'deny') {
            // inform caller about denying 
          } else {
            // if user click on cross 
            // do some think else
          }

          self.requestModal = null;
        });


      } else if (self.activeModal === null && event.stream.isVideo && event.extra.id === 'teacher-123') {
        self.requestModal = self.modalService.open(RequestModal, self.ngbModalOptions);
        self.requestModal.componentInstance.requestType = `${event.extra.name} share video with main group.`;
        self.requestModal.componentInstance.requestBody =
          `${event.extra.name} share video with mian group. Do you like to join?`;

        self.requestModal.result.then((result) => {
          console.info('close with', result);
          if (result === 'accept') {
            //   self.rtcAV.setSessionToScreenAudio();
            self.openMainModal({
              fullName: event.extra.name,
              userid: event.extra.id,
            });
            self.activeModal.componentInstance.addStream(event);
            self.rtcAV.audioVideoConnection.streamEvents[event.streamid].stream.unmute('audio');
            self.rtcAV.videoCallToGroup();

            //   self.rtcAV.joinRoom(event.userid);

          } else if (result === 'deny') {
            // inform caller about denying 
          } else {
            // if user click on cross 
            // do some think else
          }

          self.requestModal = null;
        });
        self.rtcAV.audioVideoConnection.streamEvents[event.streamid].stream.mute('audio');

      } else if (self.activeModal === null && event.stream.isAudio && event.extra.id === 'teacher-123') {
        self.requestModal = self.modalService.open(RequestModal, self.ngbModalOptions);
        self.requestModal.componentInstance.requestType = `${event.extra.name} share audio with main group.`;
        self.requestModal.componentInstance.requestBody =
          `${event.extra.name} share audio with main group. Do you like to join?`;

        self.requestModal.result.then((result) => {
          console.info('close with', result);
          if (result === 'accept') {

            self.openMainModal({
              fullName: event.extra.name,
              userid: event.extra.id,
            });
            self.activeModal.componentInstance.addStream(event);
            self.rtcAV.audioVideoConnection.streamEvents[event.streamid].stream.unmute('audio');
            //  self.rtcAV.audioCallToGroup();

            self.rtcAV.joinRoom(this.roomName);

          } else if (result === 'deny') {
            // inform caller about denying 
          } else {
            // if user click on cross 
            // do some think else
          }

          self.requestModal = null;
        });
        self.rtcAV.audioVideoConnection.streamEvents[event.streamid].stream.mute('audio');
        // if (window.confirm(`${event.fullName} want to start screen sharing with you. Do you accept?`)) {
        //   // cntx.audioVideoConnection.session = {
        //   //   data: true,
        //   // };
        //   //     cntx.audioVideoConnection.join(event.userid);
        // }


      } else {
        if (self.activeModal !== null) {
          self.activeModal.componentInstance.addStream(event);
        } else {
          console.error('model is not initialized.');
        }
      }

      self.rtcAV.showRTCobject();
    });

    this.rtcAV.onStreamEndedCallBack(function (event) {
      console.info('event.userid ', event);
      console.info('userid', self.rtcAV.audioVideoConnection.userid);

      self.remoteStreamsIds.slice(0).forEach(id => {
        if (id === event.streamid) {
          const index: number = self.remoteStreamsIds.indexOf(id);
          if (index !== -1) {
            self.remoteStreamsIds.splice(index, 1);

            console.log('$#@#$@', index);
            console.log('removing streamid', self.remoteStreamsIds);
          }

        }
      });

      if (self.activeModal !== null) {
        self.activeModal.componentInstance.deleteStream(event);
      } else {
        console.error('model is already closed.');
      }
    });


    this.rtc.onMessageObser(function (event) {
      console.log('event onMessage ', event);
      if (event.data.sendTo === sessionStorage.getItem("user") || self.checkIfGroupExist(event.data.sendTo)) {
        self.playMessageTone();
        self.storeInPendingMessages(event, self);
      }
    });


    this.rtc.on_file_start(function (file) {
      console.info('file max size ', file.maxChunks);
    });

    this.rtc.on_file_progress(function (chunk, uuid) {
      console.info(chunk.currentPosition || chunk.maxChunks);
    });

    this.rtc.on_file_end(function (event) {
      console.log('event onfile received ', event);
      const info = {
        data: {
          id: event.extra.id,
          userName: event.extra.userName,
          email: event.extra.email,
          messageType: event.extra.messageType,
          message: event,
          time: event.extra.time,
          sendTo: event.extra.sendTo,
        },
      };

      // you can render file sender component here 

      if ((info.data.sendTo === sessionStorage.getItem("user") || self.checkIfGroupExist(info.data.sendTo)) &&
        event.remoteUserId === self.rtc.multiConn.userid) {
        self.playMessageTone();
        self.storeInPendingMessages(info, self);
      }
    });

    this.rtc.onUserStatus(function (event) {
      console.info('User Status: ', event);
      /* 
      this.msgs=this._alert.showError("Error","Message");
      this.msgs=this._alert.showInfo("Info","Message"); */
      const Online = event.status === 'online';
      const Offline = event.status === 'offline';

      // if (event.status === 'online') {
      //   if (self.rtcAV.audioVideoConnection.isInitiator) {
      //     self.rtcAV.sendCustomMessage({
      //       messageFor: '',
      //       message: 'running-session',
      //       fullName: '',
      //       userid: '',
      //       session: self.rtcAV.runningSession,
      //     });
      //   }
      // }

      if (self.userToPopulate) {

        self.userToPopulate.forEach((user) => {
          if (user.id === event.userid) {
            console.log('user gonna updated', user);
            user.status = Online ? true : false;
            if (Online) {
              this.msgs=this._alert.showSuccess("Info", user.firstName + " " + user.lastName +" online");
            } 
            if (Offline) {
              this.msgs=this._alert.showSuccess("Info", user.firstName + " " + user.lastName +" offline");
            }
          }
        })

      }

      // if(event.userid === this.roomName) {


      // }

    }.bind(this));
    //////////////////////////////////////////////////////

    // this.rtc.onNewSessionCallBack(function (session) {
    //   session.join();
    //   console.info('user id', session.userid);
    //   console.info('session id', session.sessionid);
    //   console.info('session ', session.session);
    //   console.info('session extra', session.extra);
    // });


    this.rtc.onLeaveCallBack(function (event) {
      console.log(event, 'leave the room');
    });

    this.rtcAV.onNewSessionCallBack(function (session) {
      console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
        , '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      // session.join();
      console.info('user id', session.userid);
      console.info('session id', session.sessionid);
      console.info('session ', session.session);
      console.info('session extra', session.extra);
    });

    // window.addEventListener('unload', function(){
    //   console.log("on Unload", this.rtc.multiConn.getAllParticipants()[0]);
    //   this.rtc.multiConn.shiftModerationControl(this.rtc.multiConn.getAllParticipants()[0], this.rtc.multiConn.broadcasters, false);
    // }.bind(this), false);

  }
 
  checkIfGroupExist(id: string): boolean {
    let exist = false;
    console.log("GGGGGGGG", this.groups);
    if (this.groups) {
      this.groups.filter(group => {
        if (group.id === id) {
          exist = true;
        }
      });
    }
    return exist;

  }


  searchFilter_init() {

    const self = this;


    setTimeout(function () {

      const options = {
        valueNames: ['name'],
        fuzzySearch: {
          searchClass: 'fuzzy-search',
          location: 0,
          distance: 100,
          threshold: 0.4,
          multiSearch: true,
        },
      };
      this.userList = new List('people-list', options);

      const tempuserlist = this.userList.items;
      this.userList.sort('name', {
        order: 'asc', sortFunction: function (val) {
          //    console.log("userList ", val);
          // tempuserlist.forEach(item => {
          //   if(item._values.name !== 'Main Group'){
          //   return item._values.name;
          //    }
          //   // console.log(item._values.name);
          // });    
        }
      });

      const noItems = '<li id="no-items-found">No user found</li>';
      this.userList.on('updated', function (list) {
        if (list.matchingItems.length === 0) {
          self.eluserListHTML.nativeElement.innerHTML = noItems;
        }
      });
    }, 1000);
  }

  // openMainComponent() {
  //   this.openChat(groupInfo);

  // }

  playMessageTone() {
    console.log('tone palyed');
    const audioElement = this.elMessageTone.nativeElement;
    audioElement.src = '../../assets/ringtone/ding.mp3';
    const playPromise = audioElement.play();

    // const audio = new Audio('../../assets/ringtone/ding.mp3');
    // audio.play();

    if (playPromise !== undefined) {
      playPromise.then(function () {

        console.log('successfull');
        // Automatic playback started!
      }).catch(function (error) {

        console.log('custom failed to start audio');
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
      });
    }

  }


  palyCallTone() {

    const self = this;
    console.log('playing call tone');
    const audioElement = this.elcallTone.nativeElement;
    audioElement.src = '../../assets/ringtone/skypeCall.mp3';
    const playPromise = audioElement.play();

    var count = 1
    this.elcallTone.nativeElement.addEventListener('ended', function () {
      self.elcallTone.nativeElement.currentTime = 0;
      if (count <= 3) {
        self.elcallTone.nativeElement.play();
      }
      count++;
    }, false);


    if (playPromise !== undefined) {
      playPromise.then(function () {

        console.log('successfull');
        // Automatic playback started!
      }).catch(function (error) {

        console.log('custom failed to start audio');
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
      });
    }
  }

  stopCallTone() {
    console.log('call tone stoped');
    this.elcallTone.nativeElement.pause();
    this.elcallTone.nativeElement.currentTime = 0;
  }

  openChat(user: any, index: number) {
    const self = this;

    console.log('open chat ', user, index);

    this.selectedIndex = index;
    let tempComponentRef: ComponentRef<UserChatComponent> = null;
    ///check if componet already exist...
    this.chatComponentsRef.forEach(component => {

      if (component.instance.getID() === user.id) {
        tempComponentRef = component;
      }
    });

    if (tempComponentRef === null) {

      const factory: ComponentFactory<UserChatComponent> = this.resolver.resolveComponentFactory(UserChatComponent);
      tempComponentRef = this.eldynamicChatDiv.createComponent(factory);

      tempComponentRef.instance.id = user.id;
      tempComponentRef.instance.name = user.firstName;
      tempComponentRef.instance.img = this._HttpService.baseURL + 'containers/profile_pic/download/' + user.profile_pic;
      console.log("tempComponentRef.instance.img: ", tempComponentRef.instance.img);
      tempComponentRef.instance.email = user.email;
      tempComponentRef.instance.selectedIndex = index;
      tempComponentRef.instance.groupUsers = user.users;
      tempComponentRef.instance.type = user.type || 'single';
      console.log("AAAAAAAAAAAAAAAaaa", tempComponentRef.instance.type);

      tempComponentRef.instance.openMainModal$.subscribe((info) => {
        console.log('main modal info', info);
        this.openMainModal(info);
      });

      if (this.currentSession) { // if curent session pass it to new created chat div
        console.log('current session set to chat div', this.currentSession);
        tempComponentRef.instance.currentSession = this.currentSession;
      }

      tempComponentRef.instance.setActiveModal$ = this.activeModalSetter$;

      if (this.activeComponentRef === null) {
        tempComponentRef.instance.toggleView();
        this.activeComponentRef = tempComponentRef;
        this.ReRenderPendingMessages(this.activeComponentRef);
      } else {
        this.activeComponentRef.instance.toggleView();
        tempComponentRef.instance.toggleView();
        this.activeComponentRef = tempComponentRef;
        this.ReRenderPendingMessages(this.activeComponentRef);
      }
      // this.activeComponentRef = tempComponentRef;

      this.chatComponentsRef.push(tempComponentRef);

      // this.ReRenderPendingMessages(tempComponentRef);

    } else {

      if (this.activeComponentRef === null) {
        tempComponentRef.instance.toggleView();
        tempComponentRef.instance.setSessionButton();
        this.activeComponentRef = tempComponentRef;
        this.ReRenderPendingMessages(this.activeComponentRef);
      } else {
        this.activeComponentRef.instance.toggleView();
        tempComponentRef.instance.toggleView();
        tempComponentRef.instance.setSessionButton();
        this.activeComponentRef = tempComponentRef;
        this.ReRenderPendingMessages(this.activeComponentRef);
      }

      this.activeComponentRef.instance.groupUsers = user.users;

    }

  }
  // this should be onmessage
  storeInPendingMessages(event, cntx) {
    if (event !== null) {
      console.log(event);
      cntx.chatComponentsRef.forEach(component => {
        if (component.instance.id === event.data.id && component.instance.id === this.activeComponentRef.instance.id) {
          ///call render receiver component in child
          if (event.data.messageType === 'text') {
            component.instance.renderReceiverComponent(event.data);
          }
          if (event.data.messageType === 'file') {
            component.instance.renderReceiverFileComponent(event.data);
          }
          return;
        }

      });

      cntx.pendingMessages.push(event.data);

      this.updateUnreadMsg(event.data);
    }
  }

  ReRenderPendingMessages(tempComponentRef: ComponentRef<UserChatComponent>) {

    this.pendingMessages.slice(0).forEach(msg => {
      console.log('2342342', msg);
      if (msg.id === tempComponentRef.instance.id) {
        // render to child renderReceiverComponent
        if (msg.messageType === 'text') {
          tempComponentRef.instance.renderReceiverComponent(msg);
        }
        if (msg.messageType === 'file') {
          tempComponentRef.instance.renderReceiverFileComponent(msg);
        }


        const index: number = this.pendingMessages.indexOf(msg);
        if (index !== -1) {
          this.pendingMessages.splice(index, 1);

          console.log('$#@#$@', index);
          console.log('array', this.pendingMessages);
        }

        this.deleteUnreadMsgNoti(tempComponentRef);

      }
    });

  }

  getUserFriends() {
    const allFriends = [];
    let friendCount;
    this._HttpService.getData("Profiles/" + sessionStorage.getItem("user")).subscribe((resp) => {
        console.log("222222", resp);
      this.groups = resp.allGroups;

           sessionStorage.setItem("LogedInUser", JSON.stringify(resp));
         this.currentLogedInUser = resp;
      //  friendCount = resp.friendList.length;
      resp.friendList.forEach(user => {
        this._HttpService.getData("Profiles/" + user.userId).subscribe((userFriend) => {
          //  console.info("222222", userFriend);
          delete userFriend.allGroups;
          delete userFriend.friendList;
          delete userFriend.notifications;
          allFriends.push(userFriend);
        }, errInFriendList => {
          console.error(errInFriendList);
        });
      });
    }, err => {
      console.error(err);
    });
    // allFriends.filter((user) => {
    //   user.status = false;
    // });


    this.isFriendsAvailable = true;


    // while (1) {
    //   if (allFriends.length === friendCount) {

    //     break;
    //   }
    // }

    setTimeout(function () {
      console.log("3333333", allFriends.length);
      this.currentUserFriends = Object.assign([], allFriends);
      this.currentUserFriendsSecond = Object.assign([], allFriends);
      this.searchFilter_init();

      // this.userToPopulate = this.spliceUserId(allFriends);
      this.userToPopulate = allFriends;
      if (this.groups) {
        this.groups.forEach(group => {
          this.userToPopulate.push(group);
        });
      }
      // this.userToPopulate.push(this.groups);
      console.log("444444", this.userToPopulate);

    }.bind(this), 1000);



    //////////////////////////////////////////////////////
    // let id = this.route.snapshot.params['id'];

    // this._HttpService.getData("studentsCourses/student?id=" + id).subscribe((resp) => {
    //   console.info(resp);
    //   if (sessionStorage.getItem("userType") != 'instructor') {

    //   }
    //   resp = resp.filter((user) => {
    //     user.status = false;
    //     return user.id != sessionStorage.getItem("user");
    //   });
    //   this.currentUserFriends = Object.assign([], resp);
    //   this.currentUserFriendsSecond = Object.assign([], resp);
    //   this.isFriendsAvailable = true;
    //   this.searchFilter_init(cntx);
    //   this.userToPopulate = this.spliceUserId(resp);
    //  // this.userToPopulate.unshift(this.groupInfo);
    //  // this.userToPopulate.unshift({ "firstName": "teacher", "lastName": "", "profile_pic": "no-photo.png", "status": true });
    // }, err => {
    //   console.error(err);
    // });
  }

  // spliceUserId(resp) {
  //   resp.forEach(user => {
  //     user.id = user.id.substring(0, 10);
  //     //user.profile_pic_url = this._HttpService.baseURL+'containers/profile_pic/download/';
  //   });
  //   console.log(resp);
  //   return resp;
  // }

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }


  updateUnreadMsg(msg) {

    if (this.activeComponentRef && this.activeComponentRef.instance.id === msg.id) {

    } else {
      let userMsgs: number = 0;
      this.pendingMessages.forEach(tempmsg => {
        if (tempmsg.id === msg.id) {
          userMsgs++;
        }
      });

      console.log("IIIIIIIDDDDD", msg.id, userMsgs);
      const elNotify: HTMLElement = document.getElementById(msg.id);
      elNotify.innerHTML = userMsgs.toString();
      elNotify.hidden = false;


    }

  }

  deleteUnreadMsgNoti(tempComponentRef: ComponentRef<UserChatComponent>) {
    const elNotify: HTMLElement = document.getElementById(tempComponentRef.instance.id);
    elNotify.innerHTML = '0';
    elNotify.hidden = true;
  }

  removeStream(event) {
    const mediaElement = this.elvideoDiv.nativeElement.getElementById(event.streamid);
    if (mediaElement) {
      mediaElement.parent.removeChild(mediaElement);
    }

  }
  ///////////////////////////check afte video compoent...
  openVideoParent(event) {
    console.log('video in parent...captured', event);
    //this.rtc.setAndStartVideo();

  }
  openAudioParent(event) {
    console.log('event audio', event);
  }

  openMainModal(info) {
    if (this.activeModal === null) {

      //   this.activeModalFlag$.next(true);
      this.activeModal = this.modalService.open(AVmodal, this.ngbModalOptions);
      this.activeModalSetter$.next(this.activeModal);
      this.activeModal.result.then((result) => {
        console.info('close with', result);
        if (result === 'minimize') {


        } else {

          this.remoteStreamsIds.forEach(id => {
            console.log('mute stream by id', id);
            this.rtcAV.muteById(id, 'audio');
          });

          // this both sould be inside close method of modal.
          // this.activeModal.componentInstance.clearAll();
          // this.rtcAV.removeAttachStreams();


          this.remoteStreamsIds.length = 0;
          //         this.rtcAV.renegotiateSession();
          this.rtcAV.audioVideoConnection.userid = sessionStorage.getItem("user");
          if (this.rtcAV.audioVideoConnection.isInitiator) {
            // this.rtcAV.disconnect();
            // this.rtcAV.closeConnection();

            this.rtcAV.customCloseSocket();

            setTimeout(function () {
              this.rtcAV.customConnectSocket(function () {
                console.log('successfulllllly connected to socket....');

                this.rtcAV.sendCustomMessage({
                  messageFor: '',
                  message: 'update-session-btn',
                  fullName: '',
                  userid: '',
                });

              }.bind(this));
            }.bind(this), 500);

          } else {
            this.rtcAV.leaveRoom();
          }

        }
        this.activeModal = null;
        // this.rtcAV.audioVideoConnection.streams.stop();
        // this.rtcAV.removeAllStreams();
        //  this.rtcAV.removeRemoteStreams(); 

        //  this.rtcAV.dataChannelToGroup();
        //      this.activeModalFlag$.next(false);
        this.activeModalSetter$.next(this.activeModal);
      });
      this.activeModal.componentInstance.modalHeader = `Call with ${info.fullName}`;
      this.activeModal.componentInstance.emitCurrentSession.subscribe((session) => {
        console.info('current session set in file component', session);
        this.currentSession = session;
      });

      if (this.currentSession) {
        console.info('current session set to model', this.currentSession);
        this.activeModal.componentInstance.currentSession = this.currentSession;
      }

    } else {
      // SHOW U R ALREADY IN SESSSION....
    }
  }

  // userType: any;
  // course: any;
  // instructor: any;
  ngOnInit() {
    // this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    // this.userType = sessionStorage.getItem("userType")
    // let id = this.route.snapshot.params['id'];
    // this._HttpService.getData("Courses/" + id).subscribe((data) => {
    //   this.course = data.title;
    //   this.instructor = data.instructorsId;
    // if (this.userType != "instructor") {
    //   let teacher = { "firstName": "teacher", "lastName": "", "id": data.instructorsId.substring, "profile_pic": "no-photo.png", "status": true }
    //   console.log('teacher info', teacher);
    //   this.userToPopulate.push(teacher)
    // }

    // if (this.userType == 'instructor') {
    //   this._HttpService.patchData("Courses/" + id, { "status": true }).subscribe((resp)=>{
    //     console.log("Course Status patch resp:",resp);
    //   });
    //   this.roomName = sessionStorage.getItem('user').substring;
    //   sessionStorage.setItem("roomName", this.roomName);
    // }
    // else {
    //   this.roomName = this.instructor.substring;
    //   sessionStorage.setItem("roomName", this.roomName);
    // }
    // });
  }

  ngAfterViewInit() {
    const self = this;

    // let messages: any;
    // this._HttpService.getData("GroupChats/" + sessionStorage.getItem("groupChatId")).subscribe((data) => {
    //   console.log(sessionStorage.getItem('groupChatId'));
    //           messages = data.messages;

    //           messages.forEach((mesg) => {
    //             // this.activeComponentRef.instance.renderReceiverComponent(mesg);
    //             this.storeInPendingMessages(mesg, self);
    //           });
    // });





    ///  this.currentLogedInUser = JSON.parse(sessionStorage.getItem("LogedInUser"));  ///////////////////



    this.currentLogedInUser = JSON.parse(sessionStorage.getItem('LogedInUser'));
    // this.roomName = localStorage.getItem('roomOwnerID');

    // console.log("RRROOOMMM Name: ", this.roomName);
    console.log("CCCurentLogedUser; ", this.currentLogedInUser);
    // if (JSON.parse(sessionStorage.getItem('LogedInUser')).firstName === 'gohar') {
    //   //   if (this.currentLogedInUser.firstName === 'gohar') {

    //   // this.rtcAV.setSessionToData();

    //   this.rtc.openRoom2(this.roomName, true);
    //   //  this.rtcAV.openRoom2(this.roomName);
    //   //   this.rtc.openRoom();
    //   console.log('opening room in channel');
    // } else {
    //   //  this.rtcAV.setSessionToData();

    //   this.rtc.joinRoom(this.roomName);
    //   //  this.rtcAV.joinRoom(this.roomName); 
    //   //  this.rtc.openOrConnect();
    //   console.log('connecting to channel');
    // }

       this.rtc.getModerators(function(moderator){
         if (moderator.length) {
            console.log('horray', moderator[0].userid);
            this.rtc.joinRoom(moderator[0].userid);
         } else {
           console.log('there is no moderator');
           this.rtc.openRoom2(this.rtc.multiConn.userid, true);
           this.rtc.multiConn.isInitiator = true;
         }
       }.bind(this));


       setTimeout(function() {
          console.log("BroadCasters: ", this.rtc.multiConn.broadcasters);
          this.rtc.getAllParticipent();
       }.bind(this), 3000);


       setTimeout(function() {
      //  this.rtc.getAllParticipent();
      //  console.log("single user", this.rtc.multiConn.getAllParticipants()[0]);
      //  this.rtc.multiConn.shiftModerationControl(this.rtc.multiConn.getAllParticipants()[0], this.rtc.multiConn.broadcasters, false);
       if(this.rtc.multiConn.isInitiator) {
         console.log('i m initiator');
       }
     }.bind(this), 10000);

  }

  ngOnDestory() {
    // this.rtc.multiConn.shiftModerationControl(this.rtc.multiConn.getAllParticipants()[0], this.rtc.multiConn.broadcasters, false);
    this.activeComponentRef.destroy();
    this.chatComponentsRef.forEach(compo => {
      compo.destroy();
    });
  }

  openGroupManageWindow() {
    this.mainView = false;
    this.manageGroupView = true;
    this.createGroupView = false;

  }

  openCreateGroupView() {
    this.mainView = false;
    this.manageGroupView = false;
    this.createGroupView = true;
  }

  editGroup(group: any) {
    this.isGroupUpdated = true;
    console.log(group);

    this.mainView = false;
    this.manageGroupView = false;
    this.createGroupView = true;

    this.groupsForm.setValue({
      groupName: group.groupName,
    });

    group.users.forEach(user => {
      this.removeItem(user, this.currentUserFriends);
    });
    console.log(this.currentUserFriends);
    console.log(group.users);

    this.groupRefToBeUpdate = group;
    this.newGroupUsers = Object.assign([], group.users);

  }

  deleteGroup(group: any) {
    console.log(group);
    this.removeItem(group, this.userToPopulate);
    this.removeItem(group, this.groups);

    // if owner is not exist in the group users list then do the following 2 steps...

    let currentUser = JSON.parse(sessionStorage.getItem('LogedInUser'));
    group.users.push(currentUser);

    group.users.slice(0).forEach(user => {

      let url = 'Profiles?filter[fields][allGroups]=true&filter[where][id]=' + user.id;
      this._HttpService.getData(url).subscribe((allgroups) => {
        // tempAllGroups = allgroups;
        console.log('insideCreateGroup: allgroups', allgroups);
        this.removeItem(group, allgroups[0].allGroups);
        // allgroups[0].allGroups.push(newGroup);
        console.log('printing allgroups[0].allgroups', allgroups[0].allGroups);
        this._HttpService.patchData("Profiles/" + user.id, { "allGroups": allgroups[0].allGroups }).subscribe((resp) => {
          console.log("all groups patched: ", resp);
        });
        //  newGroup.users.push(user);
      });
    });
    // this._HttpService.patchData("Profiles/" + sessionStorage.getItem('user'), { "allGroups": this.groups }).subscribe((resp)=>{
    //   console.log("all groups patched: ",resp);
    // });
  }

  createGroup(event: any) {
    console.info('create group', event);
    if (this.isGroupUpdated) {
      let oldGroup = Object.assign({}, this.groupRefToBeUpdate);
      console.log('BEFORE', oldGroup.users);
      this.groupRefToBeUpdate.id = sessionStorage.getItem('user') + event.groupName;
      this.groupRefToBeUpdate.firstName = event.groupName + ' group';
      this.groupRefToBeUpdate.groupName = event.groupName;
      this.groupRefToBeUpdate.users = this.newGroupUsers;  //->> oldGroup keep reference of new group users chack it.
      this.isGroupUpdated = false;
      console.log('AFTER', oldGroup.users);
      console.log('NEWGROUPSUSERS', this.newGroupUsers);

      // this.deleteGroup(oldGroup);
      oldGroup.users.slice(0).forEach(user => {

        let url = 'Profiles?filter[fields][allGroups]=true&filter[where][id]=' + user.id;
        this._HttpService.getData(url).subscribe((allgroups) => {
          // tempAllGroups = allgroups;
          console.log('insideCreateGroup: allgroups before delete', allgroups);
          this.removeItem(oldGroup, allgroups[0].allGroups);

          console.log('printing allgroups[0].allgroups after delete', allgroups[0].allGroups);
          this._HttpService.patchData("Profiles/" + user.id, { "allGroups": allgroups[0].allGroups }).subscribe((resp) => {
            console.log("all groups patched: ", resp);
          });
          //  newGroup.users.push(user);
        });

      });


      // this.syncGroup(this.groupRefToBeUpdate);

      this.newGroupUsers.slice(0).forEach(user => {

        let url = 'Profiles?filter[fields][allGroups]=true&filter[where][id]=' + user.id;
        this._HttpService.getData(url).subscribe((allgrps) => {
          // tempAllGroups = allgroups;
          console.log('insideCreateGroup: allgroups', allgrps);
          // this.removeItem(oldGroup, allgroups[0].allGroups);
          allgrps[0].allGroups.push(this.groupRefToBeUpdate);
          console.log('printing allgroups[0].allgroups', allgrps[0].allGroups);
          this._HttpService.patchData("Profiles/" + user.id, { "allGroups": allgrps[0].allGroups }).subscribe((resp) => {
            console.log("all groups patched: ", resp);
          });
          //  newGroup.users.push(user);
        });

      });

      // this._HttpService.patchData("Profiles/" + sessionStorage.getItem('user'), { "allGroups": this.groups }).subscribe((resp)=>{
      //   console.log("all groups patched: ",resp);
      // });

    } else {
      if (this.newGroupUsers.length !== 0) {
        const newGroup = {
          id: sessionStorage.getItem('user') + event.groupName, firstName: event.groupName + ' group', type: "group",
          groupName: event.groupName, profile_pic: 'group.jpg', groupOwnerId: sessionStorage.getItem('user'), users: this.newGroupUsers
        };
        this.groups.push(newGroup);
        this.userToPopulate.push(newGroup);
        console.log(this.userToPopulate);

        // this._HttpService.patchData("Profiles/" + sessionStorage.getItem('user'), { "allGroups": this.groups }).subscribe((resp)=>{
        //   console.log("all groups patched: ",resp);
        // });

        this.syncGroup(newGroup);
      }


    }

    /////////////////////=>>> write update and create and delete code thier respective place....
    /////////////////// with all their rest url ....

    //     let tempNewGroup = Object.assign([], this.groups);
    // this.groups = [];
    //     console.log("9999999999999999",this.groups);
    //     console.log("8888888888888888",tempNewGroup);
    // let currentUser = JSON.parse(sessionStorage.getItem("LogedInUser"));
    // tempNewGroup[0].users.push(currentUser);
    // tempNewGroup[0].users.forEach((user) => {
    //   delete user['allGroups'];
    //   delete user['friendList'];
    // });

    // this.newGroupUsers.forEach(user => {

    //   this.removeItem(user, tempNewGroup[0].users);  

    //   this._HttpService.patchData("Profiles/" + user.id, { "allGroups": tempNewGroup }).subscribe((resp)=>{
    //     console.log("all groups patched: ",resp);
    //   });

    //   tempNewGroup[0].users.push(user);
    // });

    console.info(this.userToPopulate);
    this.backToManageView();

  }


  syncGroup(newGroupObj: any) {


    let newGroup = Object.assign({}, newGroupObj);
    let tempUsers = Object.assign([], newGroupObj.users);

    newGroup.users = tempUsers;

    let newGroupTemp = Object.assign({}, newGroupObj);
    let tempUsersTemp = Object.assign([], newGroupObj.users);

    newGroupTemp.users = tempUsersTemp;
    // let tempNewGroup = Object.assign([], this.groups);
    // let currentUser = JSON.parse(sessionStorage.getItem("LogedInUser"));
    // tempNewGroup[0].users.push(currentUser);
    // tempNewGroup[0].users.forEach((user) => {
    //   delete user['allGroups'];
    //   delete user['friendList'];
    // });


    let currentUser = JSON.parse(sessionStorage.getItem("LogedInUser"));
    delete currentUser.allGroups;
    delete currentUser.friendList; 
    delete currentUser.notifications;

    //this.removeItem(currentUser, newGroup.users);//////////////////updated. remove current user if any... 

    newGroup.users.push(currentUser);
    newGroupTemp.users.push(currentUser);

    // setTimeout(function() {
    //   this.removeItem(currentUser, newGroup.users);
    // }.bind(this), 5000);
// console.log(Object.assign({}, newGroupTemp.users));
    newGroupTemp.users.slice(0).forEach(user => {
      // console.log(user);
      let url = 'Profiles?filter[fields][allGroups]=true&filter[where][id]=' + user.id;
      this._HttpService.getData(url).subscribe((allgroups) => {
        // tempAllGroups = allgroups;
        // console.log('insideCreateGroup: allgroups', allgroups);
        this.removeItem(user, newGroupTemp.users);
        // console.log(Object.assign({}, newGroupTemp.users))
        allgroups[0].allGroups.push(newGroupTemp);
        // console.log('printing allgroups[0].allgroups', allgroups[0].allGroups);
        this._HttpService.patchData("Profiles/" + user.id, { "allGroups": allgroups[0].allGroups }).subscribe((resp) => {
          console.log("all groups patched: ", resp);
        }); 
        // console.log( Object.assign({}, newGroupTemp.users));
        newGroupTemp.users.push(user);
        // newGroupTemp.users = Object.assign([], newGroupObj.users);
        //   newGroupTemp.users.push(currentUser);
      });


    });

  
    this.removeItem(currentUser, newGroup.users);

    newGroup.users.slice(0).forEach(user => {
      let url = 'Profiles?filter[fields][notifications]=true&filter[where][id]=' + user.id;
      let notifyInfo = {
        text: this.currentLogedInUser.firstName + this.currentLogedInUser.lastName + " added you to the group " + newGroup.groupName,
        senderId: this.currentLogedInUser.id,
        time: this.getCurrentTime(),
        read: false,
        image: this.currentLogedInUser.profile_pic,
      };

      this._HttpService.getData(url).subscribe((allNotifications) => {
        console.log('all notification...:', allNotifications[0].notifications);
        allNotifications[0].notifications.push(notifyInfo);
  
        this._HttpService.patchData("Profiles/" + user.id, { "notifications": allNotifications[0].notifications }).subscribe((resp) => {
          console.log('notification patched', resp);
        });
      });

    });      


  }


  addToAllUsers(event: any) {
    console.info('add to user list', event);
    this.removeItem(event.dragData, this.newGroupUsers);
    this.currentUserFriends.push(event.dragData);

  }

  addToNewGroup(event: any) {
    console.info('add to new group list', event);
    this.removeItem(event.dragData, this.currentUserFriends);
    this.newGroupUsers.push(event.dragData);

  }

  // removeItem(item: any, list: Array<any>) {
  //   let index = list.map(function (e) {
  //     return e.id
  //   }).indexOf(item.id);
  //   list.splice(index, 1);
  // }
  removeItem(item: any, list: Array<any>) {
    let index; 
    list.filter(function (e) {
      if (e.id === item.id){
        index = list.indexOf(e);
        console.log(list.indexOf(e));
      }
    });
    list.splice(index, 1);
  }

  backToMain() {
    this.mainView = true;
    this.manageGroupView = false;
    this.createGroupView = false;
    this.searchPeopleView = false;


  }

  backToManageView() {
    this.mainView = false;
    this.manageGroupView = true;
    this.createGroupView = false;

    this.currentUserFriends = Object.assign([], this.currentUserFriendsSecond);
    this.newGroupUsers = [];
    this.groupsForm.setValue({
      groupName: '',
    });
  }

  clearForm() {
    this.currentUserFriends = Object.assign([], this.currentUserFriendsSecond);
    this.newGroupUsers = [];
    this.groupsForm.setValue({
      groupName: '',
    });
  }


  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      //  .do(() => this.searching = true)
      .switchMap(term => {
        if (term.length < 2) {
          return [];
        } else {
          this.searching = true;
          let data = this._HttpService.search(term)
            .do(() => {
              this.searchFailed = false;
              // this.searching = false;
            })
            .catch(() => {
              this.searchFailed = true;
              //  this.searching = false;
              return of([]);
            })
          return data;
        }
      })
      .do(() => {
        this.searching = false;
        console.log('DATA :');
      })
      .merge(this.hideSearchingWhenUnsubscribed)

  formatter = (x: { firstName: string, lastName: string }) => x.firstName + " " + x.lastName;

  // search = (text$: Observable<string>) =>
  // text$
  //   .debounceTime(200)
  //   .distinctUntilChanged()
  //   .map(term => term.length < 2 ? []
  //     : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));



  // searchPeople() {
  //   this.searchPeopleView = true;
  //   this.mainView = false;
  // }

  isFriend(id) {
    let exist: boolean = false;
    console.log(this.currentLogedInUser);
    this.currentLogedInUser.friendList.forEach((user) => {
      if (user.userId === id) {
        exist = true;
      }
    });
    return exist;

  }

  addToFriendsList(id, name) {
    console.log("######", id, name);
    let tempFriendList = Object.assign([], this.currentLogedInUser.friendList);
    let obj = {
      'userId': id
    };

    tempFriendList.push(obj);
    this._HttpService.patchData("Profiles/" + this.currentLogedInUser.id, { "friendList": tempFriendList }).subscribe((resp) => {
      console.log("friend list patched: ", resp);
    });

    this.currentLogedInUser.friendList = tempFriendList;
    sessionStorage.setItem('LogedInUser', JSON.stringify(this.currentLogedInUser));


    this._HttpService.getData("Profiles/" + id).subscribe((user) => {
      delete user.allGroups;
      delete user.friendList;
      delete user.notifications;

      this.currentUserFriends.push(user);
      this.currentUserFriendsSecond.push(user);
      this.userToPopulate.push(user);
      console.log(user);
    }, err => {
      console.error(err);
    });

    console.log(this.userToPopulate);
    this.searchFilter_init();


    let url = 'Profiles?filter[fields][notifications]=true&filter[where][id]=' + id;
    let notifyInfo = {
      text: this.currentLogedInUser.firstName + this.currentLogedInUser.lastName + " add you as a friend.",
      senderId: this.currentLogedInUser.id,
      time: this.getCurrentTime(),
      read: false,
      image: this.currentLogedInUser.profile_pic,
    };

    this._HttpService.getData(url).subscribe((allNotifications) => {
      console.log('all notification...:', allNotifications[0].notifications);
      allNotifications[0].notifications.push(notifyInfo);

      this._HttpService.patchData("Profiles/" + id, { "notifications": allNotifications[0].notifications }).subscribe((resp) => {
        console.log('notification patched', resp);
      });
    });

    if(this.userToPopulate.length < 1){
      location.reload();
    }
    
  }

  deleteFromFriends(id, name) {
    console.log('######', id, name);
    let tempFriendList = Object.assign([], this.currentLogedInUser.friendList);
    let obj = {
      'userId': id
    };

    this.removeFriends(obj, tempFriendList);

    this._HttpService.patchData("Profiles/" + this.currentLogedInUser.id, { "friendList": tempFriendList }).subscribe((resp) => {
      console.log("friend list patched: ", resp);
    });


    this.currentLogedInUser.friendList = tempFriendList;
    sessionStorage.setItem('LogedInUser', JSON.stringify(this.currentLogedInUser));


    let obj2 = {
      'id': id
    };
    this.removeItem(obj2, this.currentUserFriends);
    this.removeItem(obj2, this.currentUserFriendsSecond);
    this.removeItem(obj2, this.userToPopulate);
    console.log(this.userToPopulate);
    this.searchFilter_init();

    let url = 'Profiles?filter[fields][notifications]=true&filter[where][id]=' + id;
    let notifyInfo = {
      text: this.currentLogedInUser.firstName + this.currentLogedInUser.lastName + " remove you from there friend list.",
      senderId: this.currentLogedInUser.id,
      time: this.getCurrentTime(),
      read: false,
      image: this.currentLogedInUser.profile_pic,
    };

    this._HttpService.getData(url).subscribe((allNotifications) => {
      console.log('all notification...:', allNotifications[0].notifications);
      allNotifications[0].notifications.push(notifyInfo);

      this._HttpService.patchData("Profiles/" + id, { "notifications": allNotifications[0].notifications }).subscribe((resp) => {
        console.log('notification patched', resp);
      });
    });
  }

  removeFriends(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.userId
    }).indexOf(item.userId);
    list.splice(index, 1);
  }

  hasProp(obj, prop) {
    return obj.hasOwnProperty(prop);
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString().
      replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
  }

  // leaveClass() {
  //   let id = this.route.snapshot.params['id'];
  //   if (this.userType == 'instructor') {
  //     this._HttpService.patchData("Courses/" + id, { "status": false }).subscribe((resp)=>{
  //       console.log("Course Status false patch resp:",resp);
  //     });;
  //   }
  //   this.router.navigate(["/pages/class_room"]);

  // }

}
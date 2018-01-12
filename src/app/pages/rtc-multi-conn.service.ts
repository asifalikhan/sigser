import { Injectable, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserAuthService } from './user-auth.service';
declare let RTCMultiConnection: any;


@Injectable()
export class RtcMultiConnService implements OnInit, AfterViewInit, OnDestroy {

  multiConn: any;
  audioVideoConnection: any;
  dataFileConnection: any;
  screenShareConnection: any;

  currentLogedUser = JSON.parse(sessionStorage.getItem("LogedInUser"));


  userInfo: any;


  constructor(private userAuth: UserAuthService) {
    this.userInfo = { id: '', name: '', email: '', status: false };
    this.userInfo.id = sessionStorage.getItem('user');
    this.userInfo.name = sessionStorage.getItem('username');
    this.userInfo.email = sessionStorage.getItem('email');
    this.userInfo.status = true;

    // const userType = sessionStorage.getItem("userType");
    // if (userType === 'instructor') { 
    //   let channelName = ; 

    // }
 
   // const channelName = sessionStorage.getItem('roomName');

// console.log('Room Name in rtcmulticonnecion', channelName);
    // if (userInfo.name === 'asif') { 
    //   console.log(userInfo.name);
    this.multiConn = new RTCMultiConnection(); 
    // } else {
    //   this.multiConn = new RTCMultiConnection('numanali');
    // }
 this.showRTCobject();

  //  this.multiConn.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
  this.multiConn.socketURL = 'https://signallingone.herokuapp.com/'; 
  //this.multiConn.socketURL = 'https://192.168.8.100:9001/';
     this.multiConn.socketMesssageEvent = 'Chat-session';
     this.multiConn.userid = sessionStorage.getItem("user");
    // this.multiConn.userid = sessionStorage.getItem('user').substring(0,10);// this.spliceUserId(sessionStorage.getItem('user'), this.userInfo.name);
    // this.multiConn.sessionid =  sessionStorage.getItem('user').substring(0,10);
    
    // this.multiConn.sessionid = 'teacher-123443';
    this.multiConn.extra = this.userInfo;
    this.multiConn.enableFileSharing = true;
 
  //  if (sessionStorage.getItem('userType') === 'instructor') {
  //    console.log(this.multiConn.userid, 'set to initiator');
  //      this.multiConn.isInitiator = true;
  //      this.multiConn.autoCloseEntireSession = true;
  //   }


    this.multiConn.session = {

      audio: false,
      video: false, 
      screen: false,

      data: true,

      // audio: 'two-way',
      oneway: false,
      broadcast: false,
    };

    this.multiConn.mediaConstraints = {
      audio: false,
      video: false,
    };

    this.multiConn.sdpConstraints.mandatory = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false,
    };

    // this.multiConn.onShiftModerationControl = function(sender, existingBroadCasters){
    //   this.multiConn.acceptModerationControl(sender, existingBroadCasters);
    //   console.log("onShiftModerationContorl called");
    // };
  }

  spliceUserId(id, name): string {
    const mystr = id.substring(0, 10);
    return name+mystr;

}
  openRoom() {
    // this.audioVideo.
    // this.multiConn.extra = extra;
    this.multiConn.open();
  }

  openRoom2(id, PBMboolean) {
    // this.audioVideo.
    // this.multiConn.extra = extra;
    this.multiConn.open(id, PBMboolean);
  }

  joinRoom(roomName) {
    // this.multiConn.extra = extra;
    this.multiConn.join(roomName);
  }

  openOrJoinRoom(roomName) {
    // this.multiConn.extra = extra;
    this.multiConn.openOrJoin(roomName, function (isRoomExist, roomId) {
      if (isRoomExist) {
        console.info("room is already exist", roomId);
      }
    });
  }

  checkAndJoin(roomName) {
    const self = this;
    this.multiConn.checkPresence(roomName, function (isRoomExist, roomid) {
      if (isRoomExist === true) {
        self.joinRoom(roomid);
        console.info('Room Joining');
      } else {
        self.openRoom2(roomid, true);
        console.info('opening room');
      }
    });
    console.log("$#@#$@%@#$@#%@#$@@#$@@#$@#%@#$", self.multiConn.channel);
  }

  openOrConnect() {

    this.multiConn.connect();
}

  checkandjoin22() {
    if (this.userInfo.name === 'asif') { 
      this.multiConn.open();
      // this.multiConn.Initiator = true;
    }
    else {
      this.multiConn.connect();
    }
  }

  connectToRoom(roomName) {
    this.multiConn.connect(roomName);
  }


  getModerators(callback) {
    this.multiConn.getPublicModerators(callback);
  }

  shiftControl(remoteUserId, broadCasters, fireOnLeave) {
    this.multiConn.shiftModerationControl(remoteUserId, broadCasters, fireOnLeave);
  }

  // onControlShifted(callback) {
  //   this.multiConn.acceptModerationControl = callback;
  // }

  onUserStatus(callback) {
    this.multiConn.onUserStatusChanged = callback;
  }
  onNewSessionCallBack(callback) {
    this.multiConn.onNewSession = callback;

  }

  onLeaveCallBack(callback) {
    this.multiConn.onleave = callback;
  }

  leaveRoom() {
    this.multiConn.leave();
  }

  closeEntireSession() {
    this.multiConn.closeEntireSession();
  }

  sendText(message) {
    this.multiConn.send(message);
  }

  sendTextToSpecific(message, id) {
    this.multiConn.send(message, id);
  }

  shareFiles(data) {
    this.multiConn.shareFile(data);
  }

  onMessageObser(callback) {
    this.multiConn.onmessage = callback;
  }

  onCustomMsg(callback) {
    this.multiConn.onCustomMessage = callback;
  }

  sendCustomMsg(privateMsgData) {
    const self = this;

    console.log(this.multiConn);
    this.multiConn.sendCustomMessage(privateMsgData);
  }

  on_file_start(callback) {
    this.multiConn.onFileStart = callback;
  }
  on_file_progress(callback) {
    this.multiConn.onFileProgress = callback;
  }
  on_file_end(callback) {
    this.multiConn.onFileEnd = callback;
  }

  onUserStatusChangedObser() {
    return new Observable<any>(observer => {
      this.multiConn.onUserStatusChanged((event) => {
        observer.next(event);
      });
    });
  }

  setAndStartVideo() {
    this.multiConn.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };
    this.multiConn.mediaConstraints = {
      video: true,
      audio: true,
    };
    this.multiConn.addStream({
      audio: true,
      video: true,
    });
  }
 
  onStream(callback) {
    this.multiConn.onstream = callback;
  }

  getAllParticipent() {
    console.log("all Users", this.multiConn.getAllParticipants());
  }

  showRTCobject() {
    console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.info('rtcObj', this.multiConn);
    console.info('#####################################');
}


  ngOnInit() {



    // this.multiConn.shiftModerationControl(this.multiConn.getAllParticipants()[0], this.multiConn.broadcasters, true);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }


}

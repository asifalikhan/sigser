import { Injectable, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserAuthService } from './user-auth.service';

declare let RTCMultiConnection: any;
declare let getScreenConstraints: any;

@Injectable()
export class AudioVideoService implements OnInit, AfterViewInit, OnDestroy {

    audioVideoConnection: any;

    userInfo: any;
    public runningSession: string = 'none';

    constructor(private userAuth: UserAuthService) {
        const self = this;
        this.userInfo = {};
        this.userInfo.id = sessionStorage.getItem('user');
        this.userInfo.name = sessionStorage.getItem('username');
        this.userInfo.email = sessionStorage.getItem('email')
        this.userInfo.status = true;

        const userid: string = this.userInfo.id;
 
        const channelName = sessionStorage.getItem('roomName');
        
        console.log('Room Name in rtcmulticonnecion', channelName);
 
        this.audioVideoConnection = new RTCMultiConnection(channelName); 
this.showRTCobject();
     //   this.audioVideoConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
     this.audioVideoConnection.socketURL = 'https://signalling-av.herokuapp.com/'; 
      //  this.audioVideoConnection.socketURL = 'https://192.168.8.100:9001/';
      // this.audioVideoConnection.socketURL = 'https://localhost:9001/'; 
      
      this.audioVideoConnection.socketMessageEvent = 'AudioVideoSession';
        //  this.audioVideoConnection.sessionid = 'teacher-123443';
        this.audioVideoConnection.userid = sessionStorage.getItem('user');
        this.audioVideoConnection.extra = this.userInfo;
 //       this.audioVideoConnection.autoCloseEntireSession = true;
        this.audioVideoConnection.socketCustomEvent = this.audioVideoConnection.channel;
        this.audioVideoConnection.enableFileSharing = true;


        this.audioVideoConnection.direction = 'one-to-many';  
        //     this.audioVideoConnection.connectSocket();
        if (sessionStorage.getItem('userType') === 'instructor') {
            this.audioVideoConnection.extra.id = 'teacher-123';
        }


        this.audioVideoConnection.getScreenConstraints = function (callback) {
            getScreenConstraints(function (error, screen_constraints) {
                if (!error) {
                    screen_constraints = self.audioVideoConnection.modifyScreenConstraints(screen_constraints);
                    callback(error, screen_constraints);
                    return;
                }
                console.log(error);
                throw error;
            });
        };
        // this.connectToCustomSocket2(this);
    }

    // spliceUserId(id, name): string {
    //     const mystr = id.substring(0, 10);
    //     return name + mystr;

    // }

    renegotiateSession() {
        this.setSessionToNone();
        this.audioVideoConnection.renegotiate();
    }

    connectToCustomSocket(callback) {
        this.audioVideoConnection.connectSocket(callback);
    }

    setSessionToNone() {
        this.audioVideoConnection.session = {
            audio: false,
            video: false,
            data: false,
            oneway: true,
        };
    }

    setSessionToData() {
        this.audioVideoConnection.session = {
            audio: false,
            video: false,
            //  oneway: true,
            data: true,
        };
        this.audioVideoConnection.mediaConstraints = {
            audio: false,
            video: false,
        };
        this.audioVideoConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false,
        };
    }
    setSessionToAudio() {

        this.runningSession = 'audio';

        this.audioVideoConnection.session = {
            audio: true,
            video: false,
            oneway: false,
            broadcast: false,
        };
        this.audioVideoConnection.mediaConstraints = {
            audio: true,
            video: false,
        };
        this.audioVideoConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false,
        };
    }

    setSessionToAudioOneway() {
        this.audioVideoConnection.session = {
            audio: true,
            video: false,
            oneway: true,
        };
        this.audioVideoConnection.mediaConstraints = {
            audio: true,
            video: false,
        };
        this.audioVideoConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false,
        };
    }

    setSessionToVideo() {

        this.runningSession = 'video';

        this.audioVideoConnection.session = {
            audio: true,
            video: true,
        };
        this.audioVideoConnection.mediaConstraints = {
            audio: true,
            video: true,
        };
        this.audioVideoConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
        };

    }

    setSessionToScreenAudio() {

        this.runningSession = 'screen';

        this.audioVideoConnection.session = {

            //audio: true,
            video: false,
            screen: true,

            // data: false,

            audio: 'two-way',
            oneway: true,
            // broadcast: false,
        };

        this.audioVideoConnection.mediaConstraints = {
            audio: true,
            video: false,
        };

        this.audioVideoConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false,
        };
    }
    dataChannelToGroup() {
        this.setSessionToData();
        this.audioVideoConnection.addStream({
            audio: false,
            video: false,
            data: true,
        });
    }
    audioCallToGroup() {
        this.setSessionToAudio();
        this.audioVideoConnection.addStream({
            audio: true,
            video: false,
        });
    }

    videoCallToGroup() {
        this.setSessionToVideo();
        this.audioVideoConnection.addStream({
            audio: true,
            video: true,
        });
    }

    shareScreenToGroup() {
        this.setSessionToScreenAudio();
        this.audioVideoConnection.addStream({
            audio: true,
            screen: true,
            oneway: true,
        });
    }

    openOrConnect() {
        //     if (this.userInfo.name === 'asif') {
        //         this.audioVideoConnection.open();
        //     } else {
        this.audioVideoConnection.connect();
        // }
    }

    onMediaErrorCallback(callback) {
        this.audioVideoConnection.onMediaError = callback;
    }

    closeEntireSession() {
        this.audioVideoConnection.closeEntireSession();
    }

    removeStreamById(id) {
        this.audioVideoConnection.removeStream(id);
    }

    removeVideoStream() {
        this.audioVideoConnection.removeStream('video');
    }

    removeAudioStream() {
        this.audioVideoConnection.removeStream('audio');
    }

    removeAllStreams() {
        this.audioVideoConnection.removeStream({
            screen: true,
            audio: true,
            video: true,
        });
    }

    onMute(callback) {
        this.audioVideoConnection.onmute = callback;
    }
    onUnMute(callback) {
        this.audioVideoConnection.onunmute = callback;
    }

    muteAll() {
        this.audioVideoConnection.peers.forEach(peer => {
            this.audioVideoConnection.streamEvents[peer.streamid].stream.mute('both');
        });

    }

    muteById(streamid, type) {
        this.audioVideoConnection.streamEvents[streamid].stream.mute(type);
    }
    unMuteById(streamid, type) {
        this.audioVideoConnection.streamEvents[streamid].stream.unmute(type);
    }

    muteByIdType(streamid, type) {
        console.log('stream stoped from video', streamid, type);
        this.audioVideoConnection.streams[streamid].mute({
            audio: type === 'audio',
            video: type === 'video',
        });
    }

    ejectRemoteUser(userid) {
        if (this.audioVideoConnection.isInitiator) {
            this.audioVideoConnection.deletePeer(userid);
       }
    }

    videocallToSpecific(userid) {

        console.log(this.audioVideoConnection);
        this.audioVideoConnection.mediaConstraints = {
            audio: true,
            video: true,
        };
        this.audioVideoConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
        };

        this.audioVideoConnection.peers[userid].addStream({
            audio: true,
            video: true,
        });
    }

    audioCallToSpecific(userId) {



    }

    sendCustomMessage(message) {
        this.audioVideoConnection.socket.emit(this.audioVideoConnection.socketCustomEvent, message);
    }

    openRoomForUser(userid) {
        this.audioVideoConnection.open(userid);
    }

    showRTCobject() {
        console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.info('rtcObj', this.audioVideoConnection);
        console.info('#####################################');
    }


    sendText(message) {
        this.audioVideoConnection.send(message);
    }

    onMessageObser(callback) {
        this.audioVideoConnection.onmessage = callback;
    }



    onCustomMsg(callback) {
        this.audioVideoConnection.onCustomMessage = callback;
    }

    requestToUser(userid) {
        this.audioVideoConnection.request(userid);
    }

    onrequestCallback(callback) {
        this.audioVideoConnection.onRequest = callback;
    }

    removeAttachStreams() {
        this.audioVideoConnection.attachStreams.forEach(stream => {
            stream.stop();
            console.info(stream, 'stoped');
        });
    }

    removeRemoteStreams() {
        this.audioVideoConnection.attachStreams.forEach(function (stream) {
            stream.mute(); // mute all tracks
        });
    }



    leaveRoom() {
        console.info('room leaved');
        this.audioVideoConnection.leave();
    }
    disconnect() {
        this.audioVideoConnection.disconnect();
    }

    onDisconnectCallBack(callback) {
        this.audioVideoConnection.ondisconnected = callback;
    }


    closeConnection() {
        this.audioVideoConnection.close();
    }

    customConnectSocket(callback) {
        this.audioVideoConnection.connectSocket(callback);
    }

    customCloseSocket() {
        this.audioVideoConnection.closeSocket();
    }

    onNewSessionCallBack(callback) {
        this.audioVideoConnection.onNewSession = callback;
    }

    onLeaveCallBack(callback) {
        this.audioVideoConnection.onleave = callback;
    }

    onStreamCallBack(callback) {
        this.audioVideoConnection.onstream = callback;
    }

    onStreamEndedCallBack(callback) {
        this.audioVideoConnection.onstreamended = callback;
    }


    openRoom() {
        // this.audioVideo.
        // this.multiConn.extra = extra;
        this.audioVideoConnection.open();
    }
    openRoom2(roomname) {
        this.audioVideoConnection.open(roomname);
    }

    joinRoom(roomName) {
        // this.multiConn.extra = extra;
        this.audioVideoConnection.join(roomName);
    }

    connectRoom(roomName) {
        this.audioVideoConnection.connect(roomName);
    }

    checkAndJoin(roomName) {
        const self = this;
        this.audioVideoConnection.checkPresence(roomName, function (isRoomExist, roomid) {
            if (isRoomExist === true) {
                self.joinRoom(roomid);
                console.info('Joining room', roomid);
            } else {
                self.openRoom2(roomid);
                console.info('opening room', roomid);
            }
        });
    }

    checkRoomPresence(roomId, callback) {
 //       let roomExist: boolean = false;
        this.audioVideoConnection.checkPresence(roomId, function(isRoomExist, roomId){
           // roomExist = isRoomExist;
            callback(isRoomExist);
        });
      // return roomExist;
    }

    emptyOpenConnect() {
        if (this.userInfo.name === 'asif') {
            this.audioVideoConnection.open();
            // this.multiConn.Initiator = true;
        } else {
            this.audioVideoConnection.connect();
        }
    }


    getAllParticipent() {
        console.log('users....', this.audioVideoConnection.getAllParticipants().join(', '));
    }


    onSpeaking(callback) {
        this.audioVideoConnection.onspeaking = callback;
    }
    
    onSilence(callback) {
        this.audioVideoConnection.onsilence = callback;
    }

    onVolumeChange(callback) {
        this.audioVideoConnection.onvolumechange = callback;
    }
    // connection.onvolumechange = function(event) {
    //     event.mediaElement.style.borderWidth = event.volume;
    // };

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        // this.audioVideoConnection.close();
        // this.audioVideoConnection.disconnect();

    }

}

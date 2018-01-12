import { Injectable, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserAuthService } from './user-auth.service';

declare let RTCMultiConnection: any;
declare let getScreenConstraints: any;

@Injectable()
export class ScreenAudioService implements OnInit, AfterViewInit, OnDestroy {

    audioVideoConnection: any;

    userInfo: any;

    constructor(private userAuth: UserAuthService) {
        const self = this;
        this.userInfo = { id: '', name: '', email: '', status: false };
        this.userInfo.id = sessionStorage.getItem('user');
        this.userInfo.name = sessionStorage.getItem('username');
        this.userInfo.email = sessionStorage.getItem('email');
        this.userInfo.status = true;

        this.audioVideoConnection = new RTCMultiConnection('ScreenAudioChannel');

        this.audioVideoConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
        this.audioVideoConnection.socketMesssageEvent = 'ScreenAudioSession';
        this.audioVideoConnection.sessionid = 'ScreenAudioSession';
        this.audioVideoConnection.extra = this.userInfo;
        this.audioVideoConnection.autoCloseEntireSession = true;

        this.audioVideoConnection.getScreenConstraints = function (callback) {
            getScreenConstraints(function (error, screen_constraints) {
                if (!error) {
                    screen_constraints = self.audioVideoConnection.modifyScreenConstraints(screen_constraints);
                    callback(error, screen_constraints);
                    return;
                }
                throw error;
            });
        };

    }

    onUserStatus(callback) {
        this.audioVideoConnection.onUserStatusChanged = callback;
    }

    getUserInternalStream(targetUserId) {
        let user = this.audioVideoConnection.peers[targetUserId];
        console.log('user....', user);
        user.streams.forEach(remoteStreamId => {
            let stream = this.audioVideoConnection.streamEvents[remoteStreamId];
            console.log('gettign remote stream', stream);
        });
    }

    setSessionToScreenAudio() {
        this.audioVideoConnection.session = {

            //audio: true,
            video: false,
            screen: true,
            oneway: true,
            // data: false,

            audio: 'two-way',

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


    openOrConnect() {
        this.audioVideoConnection.connect();
    }

    closeEntireSession() {
        this.audioVideoConnection.closeEntireSession();
    }

    removeAttachStreams() {
        this.audioVideoConnection.attachStreams.forEach(stream => {
            stream.stop();
            console.info(stream, 'stoped');
        });
    }

    leaveRoom() {
        this.audioVideoConnection.leave();
    }

    closeConnection() {
        this.audioVideoConnection.close();
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


    openRoom(roomName) {
        this.audioVideoConnection.open(roomName, {
            dontTransmit: true,
        });
    }

    joinRoom(roomName) {
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
                self.openRoom(roomid);
                console.info('opening room', roomid);
            }
        });
    }


    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

}


import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';

import { AudioVideoService } from '../../rtc-AV.service';
import { Subject } from "rxjs/Subject";

declare let getHTMLMediaElement: any;
declare let RecordRTC: any;
declare let getMediaElement: any;
// declare let hark: any;

// import { SenderComponent } from './senderComponent';
// import { ReceiverComponent } from './receiverComponent';
// import { RtcMultiConnService } from '../../rtc-multi-conn.service';
// import { UserAuthService } from '../../user-auth.service';

@Component({
   // selector: 'video-component',
    template: ` 
        <div #videoDiv class="container-vid">
            <div class = "overlay">
                <p>{{name}}</p>
            </div> 
            <div class= "meter-overlay">
            <i class="fa fa-volume-up" aria-hidden="true"></i>
                <meter #volMeter value ="-20" min="-100" low="-85" optimum="-50" high="-15" max="0"></meter>
            </div>
         </div> `,
    styleUrls: ['./sendReceive-template.scss'],
})
export class VideoChatComponent implements OnInit, AfterViewInit, OnDestroy {


    @Input() id: string;
    @Input() img: URL;
    @Input() name: string;
    @Input() emial: string;
    @Input() streamId: string;
    //    @Input() someval/////


    video: HTMLVideoElement;
    rtcStream: any;
    mediaElement: any;
    speechEvents: any;
    buttons: any;
    toggleButton: any;


    @ViewChild('videoDiv') elvideoDiv: ElementRef;
    @ViewChild('volMeter') elvolMeter: ElementRef;

    private recorder: any;
    self: any;
    
    onSpeakingEvent$: Subject<any>;
    onSilenceEvent$: Subject<any>;
    onVolumeChangeEvent$: Subject<any>;
    
    onMuteEvent$: Subject<any>;
    onUnMuteEvent$: Subject<any>;

    constructor(private rtcAV: AudioVideoService) {
        this.self = this;
        this.video = document.createElement('video');

       // this.video.width = 265;
      //  this.video.height = 200;
        this.video.style.border = '2px solid #444b53';

    }

    manipulateEvent(cntx) {
        console.info('inside video-div element', cntx.video);

        this.rtcStream.mediaElement.removeAttribute('src');
        this.rtcStream.mediaElement.removeAttribute('srcObject');

 
        // if (this.rtcStream.type === 'remote') {
        //     this.initHark({
        //         stream: cntx.rtcStream.stream,
        //         streamedObject: cntx.rtcStream,
        //         connection: cntx.rtcAV.audioVideoConnection,
        //     });
        //     console.log('hark initialized '); 
        // }


        cntx.video.controls = true;
        if (this.rtcStream.type === 'local') {
            cntx.video.muted = true;
           // this.toggleButton = ['mute-audio'];
        }
        cntx.video.srcObject = cntx.rtcStream.stream;

        if (this.rtcAV.audioVideoConnection.isInitiator) {
            if (this.rtcStream.type === 'local') {
                this.buttons = ['mute-video', 'record-video', 'record-audio', 'full-screen'];
            } else {

                this.buttons = ['mute-video', 'record-video', 'record-audio', 'full-screen', 'stop'];    
            }
        } else {
            this.buttons = ['mute-video', 'full-screen', 'record-video'];
            

        }
                        
        this.mediaElement = getMediaElement(cntx.video, {
            title: cntx.name,

            // buttons: ['mute-audio', 'mute-video', 'record-video', 'full-screen', 'stop'],
              // toggle: ['mute-video', 'record-video', 'full-screen'],
            buttons: this.buttons,
           // toggle: this.toggleButton,
            
              onMuted: function(type) { 
                  console.log('muted', type);
                  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                  cntx.rtcAV.muteById(cntx.rtcStream.streamid, type);
               //   cntx.rtcAV.muteByIdType(cntx.rtcStream.streamid, type);
                
                  // cntx.rtcAV.onMute(function(e) {
                //      console.log('e indise onmute', e, type);
  
                //   //  cntx.rtcAV.muteById(cntx.rtcStream.streamid);
                
                // });
              },
              
              onUnMuted: function(type) {
                  console.log('unmuted', type);
                  cntx.rtcAV.unMuteById(cntx.rtcStream.streamid, type);

               },
            onRecordingStarted: function(type) {
              console.log('recording start');
              cntx.recorder = RecordRTC(cntx.rtcStream.stream, { type: type});
              cntx.recorder.startRecording();
            },
            onRecordingStopped: function(type) {
              console.log('recording stop');
                cntx.recorder.stopRecording(function () {
                const blob = cntx.recorder.getBlob();
               // const record = document.createElement('video');
               // record.src = URL.createObjectURL(blob);
               // self.elAudioContainer.nativeElement.appendChild(record);
               // record.play();
               // console.log(self.recorder);

             //    cntx.recorder.writeToDisk();
                this.save(new Date().toLocaleString()); 
              });
            },
            onStopped: function() {
                console.log('stoped');
                cntx.rtcAV.ejectRemoteUser(cntx.rtcStream.userid);
            },
            width: 250,
            height: 180,
            showOnMouseEnter: true,
        });

        cntx.elvideoDiv.nativeElement.appendChild(cntx.mediaElement);

        setTimeout(function () {
            cntx.mediaElement.media.play();
        }, 3000);

        cntx.mediaElement.id = cntx.rtcStream.streamid;
        // mediaElement.style.width = mediaElement.media.videoWidth + '400px';
        // mediaElement.style.height = mediaElement.media.videoHeight + '300px';
    }


    ngOnInit() {

    }

    ngAfterViewInit() {
        const self = this;
        // this.id = this.rtcStream.userid;
        // this.name = this.rtcStream.extra.name;
        // this.emial = this.rtcStream.extra.email;
        this.manipulateEvent(this.self);
       // self.video.poster = '../../assets/general/novideo.png';

      //  this.video.addEventListener('ended',function() { console.log('ended event fired'); self.video.load(); })
      //  this.video.onpause = function() {
      //  console.log('video paused ');
     //   self.video.load();
      //  self.video.poster = '../../assets/general/novideo.png';
   // }

        this.onMuteEvent$.subscribe((e) => {
            console.log("##########################################33");
            console.log('mute Event ',self.id, e.userid);
            if (self.id === e.userid) {
                console.log('muted fired', e.userid);
                console.log('meida element ', self.mediaElement);
              //  self.video.pause();
                 self.mediaElement.setAttribute('poster', '../../assets/general/novideo.png');
                //   self.mediaElement.poster = '../../assets/general/novideo.png';
                 //self.video.setAttribute('poster', 'https://www.w3schools.com/images/w3schoolscomlogo.png');
              //  self.video.setAttribute('poster', '../../assets/general/novideo.png');
            }
        });


        this.onUnMuteEvent$.subscribe((e) => {
            console.log('un mute Event ',self.id, e.userid);
            if (self.id === e.userid) {
                console.log('unmuted fired', e);
            }
        });


        this.onSilenceEvent$.subscribe((e) => {
                if (self.id === e.userid) {
                console.log(self.name, 'stop speaking');
                self.video.style.border = '';
               // console.log(e);
                }
        });

        this.onSpeakingEvent$.subscribe((e) => {
                if (self.id === e.userid) {
                console.log(self.name, 'speaking');
                self.video.style.border = '3px solid red';
               // console.log(e);
                }
        });

        this.onVolumeChangeEvent$.subscribe((e) => {
            console.log('volume change ',e.userid, self.id);
                if (self.id === e.userid) {
                console.log('changing volume of ', self.name, e.volume);
                self.elvolMeter.nativeElement.value = (e.volume.toFixed(3));
              //  self.video.style.borderWidth = e.volume;
               // console.log(e); 
                }
        }); 
 
        // this.rtcAV.onSpeaking(function(e) {
        //     if (self.id === e.userid) {
        //         console.log(self.name, 'speaking');
        //         self.video.style.border = '3px solid red';
        //        // console.log(e);
        //     }
        // });

        // this.rtcAV.onSilence(function(e) {
        //     if (self.id === e.userid) {
        //         console.log(self.name, 'stop speaking');
        //         self.video.style.border = '';
        //        // console.log(e);
        //     }     
        // });

        // // this.rtcAV.onVolumeChange(function(e) {
        // //     if (self.id === e.userid) {
        // //         console.log('changing volume of ', self.name);
        // //         self.video.style.borderWidth = e.volume;
        // //        // console.log(e);
        // //     }

        // // })

    }

    // initHark(args) {
    //     // if (!window.hark) {
    //     //     throw 'Please link hark.js';
    //     //     return;
    //     // }
    
    //     const connection = args.connection;
    //     const streamedObject = args.streamedObject;
    //     const stream = args.stream;
    
    //     const options = { 
    //         // threshold: -5,
    //     }; 
    //     // this.speechEvents = hark(stream, options); 
    
    //     this.speechEvents.on('speaking', function() {
    //         connection.onspeaking(streamedObject);
    //     });
    
    //     this.speechEvents.on('stopped_speaking', function() {
    //         connection.onsilence(streamedObject);
    //     });
     
    //     this.speechEvents.on('volume_change', function(volume, threshold) {
    //         console.log('volume, threshold ',volume, threshold);
    //         streamedObject.volume = volume;
    //         streamedObject.threshold = threshold;
    //         connection.onvolumechange(streamedObject);
    //     });

    //     setTimeout(function() {
    //         this.speechEvents.stop();
    //     }, 10000);
    // }

    stopSpeechEvent() {
        this.speechEvents.stop();
    }

    ngOnDestroy() {
      //  this.speechEvents.stop();

    }
}
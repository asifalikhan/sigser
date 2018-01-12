
import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';

declare let getHTMLMediaElement: any;
declare let RecordRTC: any;

// import { SenderComponent } from './senderComponent';
// import { ReceiverComponent } from './receiverComponent';
// import { RtcMultiConnService } from '../../rtc-multi-conn.service';
// import { UserAuthService } from '../../user-auth.service';

@Component({
    selector: 'video-component',
    template: ` 
        <div #videoDiv class="container-vid">
            <div class = "overlay">
                <p>{{id}}</p>
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



    @ViewChild('videoDiv') elvideoDiv: ElementRef;

    private recorder: any;
    self: any;

    constructor() {

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


        cntx.video.controls = true;
        if (this.rtcStream.type === 'local') {
            cntx.video.muted = true;
        }
        cntx.video.srcObject = cntx.rtcStream.stream;

        const mediaElement = getHTMLMediaElement(cntx.video, {
            title: cntx.userid,
            buttons: ['mute-audio', 'record-video', 'full-screen', 'stop'],
            //  toggle: ['mute-audio', 'mute-video', 'record-audio', 'record-video'],

            // onRecordingStarted(type) {
            //   console.log('recording start');
            //   this.self.recorder = RecordRTC(event.stream, { type: 'video' });
            //   this.self.recorder.startRecording();
            // },
            // onRecordingStopped(type) {
            //   console.log('recording stop');
            //   self.recorder.stopRecording(function () {
            //     // const blob = self.recorder.getBlob();
            //     // const record = document.createElement('video');
            //     // record.src = URL.createObjectURL(blob);
            //     // self.elAudioContainer.nativeElement.appendChild(record);
            //     // record.play();
            //     // console.log(self.recorder);

            //     // self.recorder.writeToDisk();
            //   });
            // },
            width: 300,
            height: 200,
            showOnMouseEnter: false,
        });

        cntx.elvideoDiv.nativeElement.appendChild(mediaElement);

        setTimeout(function () {
            mediaElement.media.play();
        }, 3000);

        mediaElement.id = cntx.rtcStream.streamid;
        // mediaElement.style.width = mediaElement.media.videoWidth + '400px';
        // mediaElement.style.height = mediaElement.media.videoHeight + '300px';
    }


    ngOnInit() {

    }

    ngAfterViewInit() {
        // this.id = this.rtcStream.userid;
        // this.name = this.rtcStream.extra.name;
        // this.emial = this.rtcStream.extra.email;
        this.manipulateEvent(this.self);

    }

    ngOnDestroy() {

    }
}

import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input, ComponentFactoryResolver,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
declare let getHTMLMediaElement: any;
declare let RecordRTC: any;

@Component({
    selector: 'audio-component',
    template: ` 
        <div #audioDiv class="container-vid">
            <div class = "overlay">
                <p>{{name}}</p>
            </div>
         </div> `,
    styleUrls: ['./sendReceive-template.scss'],
})

export class AudioChatComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() id: string;
    @Input() img: URL;
    @Input() name: string;
    @Input() emial: string;
    @Input() streamId: string;

    audio: HTMLAudioElement;
    rtcStream: any;
    speechEvents: any;

    @ViewChild('audioDiv') elaudioDiv: ElementRef;

    private recorder: any;
    self: any;

    onSpeakingEvent$: Subject<any>;
    onSilenceEvent$: Subject<any>;
    onVolumeChangeEvent$: Subject<any>;

    onMuteEvent$: Subject<any>;
    onUnMuteEvent$: Subject<any>;

    constructor() {

        this.self = this;
        this.audio = document.createElement('audio');

        this.audio.style.width = '300px';
        this.audio.style.height = '60px';
        this.audio.style.border = '2px solid #444b53';
        this.audio.style.backgroundColor = '#0952ab';

    }

    manipulateEvent(cntx) {
        console.info('inside audio-div element', cntx.audio);

        cntx.audio.controls = true;
        if (this.rtcStream.type === 'local') {
            cntx.audio.muted = true;
        }
        cntx.audio.srcObject = this.rtcStream.stream;

        // const mediaElement = getHTMLMediaElement(cntx.audio, {
        //     title: cntx.name,
        //     buttons: ['mute-audio', 'record-audio', 'stop'],
        //    // toggle: ['mute-audio', 'record-audio'],

        //     // onRecordingStarted(type) {
        //     //   console.log('recording start');
        //     //   this.self.recorder = RecordRTC(event.stream, { type: 'video' });
        //     //   this.self.recorder.startRecording();
        //     // },
        //     // onRecordingStopped(type) {
        //     //   console.log('recording stop');
        //     //   self.recorder.stopRecording(function () {
        //     //     // const blob = self.recorder.getBlob();
        //     //     // const record = document.createElement('video');
        //     //     // record.src = URL.createObjectURL(blob);
        //     //     // self.elAudioContainer.nativeElement.appendChild(record);
        //     //     // record.play();
        //     //     // console.log(self.recorder);

        //     //     // self.recorder.writeToDisk();
        //     //   });
        //     // },
        //     // width: 400,
        //     // height: 150,
        //     showOnMouseEnter: true,
        // });

        cntx.elaudioDiv.nativeElement.appendChild(cntx.audio);

        setTimeout(function () {
            cntx.audio.play();
        }, 3000);

    //     mediaElement.id = cntx.rtcStream.streamid;
    //    mediaElement.style.width =  '300px';
    //    mediaElement.style.height =  '60px';


    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        
        this.manipulateEvent(this.self);

    }

    ngOnDestroy() {

    }


}
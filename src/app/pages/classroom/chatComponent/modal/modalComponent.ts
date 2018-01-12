
import {
  Component, OnInit, ViewChild, ViewContainerRef,
  ComponentRef, ComponentFactory, ComponentFactoryResolver,
  AfterViewInit, OnDestroy, ElementRef,
} from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VideoChatComponent } from '../videoComponent';
import { AudioChatComponent } from '../audioComponent';

import { AudioVideoService } from '../../../rtc-AV.service';


import { Subject } from 'rxjs/Subject';

// declare let hark: any;

// declare let $: any;
@Component({
  //  selector: 'ngbd-modal-basic',
  templateUrl: './modal.component.html',

  styleUrls: ['./modal.component.scss'],
})
export class AVmodal implements OnInit, AfterViewInit {

  @ViewChild('videoAudioDiv') elvideoAudioDiv;
  @ViewChild('videoAudioPlacedHere', { read: ViewContainerRef }) elvideoAudioPlacedHere;

  @ViewChild('myVideoAudioDiv') elmyVideoAudioDiv;
  @ViewChild('myVideoAudioPlacedHere', { read: ViewContainerRef }) elmyVideoAudioPlacedHere;
  //  @ViewChild('mainModal') elmainModal;

  @ViewChild('modalone') elmodalone: ElementRef;
  // @ViewChild('modalone') elmodalone;

  videoComponentsRef: ComponentRef<VideoChatComponent>[] = [];
  audioComponentsRef: ComponentRef<AudioChatComponent>[] = [];

  speechEvents = [];


  closeResult: string;
  modalHeader: string;
  modalContent: string = `Lorem ipsum dolor sit amet,
   consectetuer adipiscing`;

  stream: any;


  // $content: any;
  // $modal: any;
  // $apnData: any;
  // $modalCon: any;

  emitCurrentSession: Subject<any> = new Subject();
  currentSession: any;

  onSpeakingEvent$: Subject<any> = new Subject();
  onSilenceEvent$: Subject<any> = new Subject();
  onVolumeChangeEvent$: Subject<any> = new Subject();

  onMuteEvent$: Subject<any> = new Subject();
  onUnMuteEvent$: Subject<any> = new Subject();

  constructor(private activeModal: NgbActiveModal,
    private resolver: ComponentFactoryResolver,
    private rtcAV: AudioVideoService) {
    // $(document).ready(function () {
    //   console.log('jquery is ready');

    //   $(document).ready(function () {
    //     $('.modal-content').draggable({
    //       handle: '.modal-header',
    //       opacity: 0.8,
    //       cursor: 'move',
    //     });

    //     $('.modal-content').resizable({
    //       minWidth: 400,
    //       minHeight: 300,
    //     });
    //   });
    // });


    //     $('.modalMinimize').on('click', function () {
    // console.log('line 1');
    //       this.$modalCon = $(this).closest('.mymodal').attr('id');
    //       console.log('line 2');
    //       this.$apnData = $(this).closest('.mymodal');
    //       console.log('line 3');
    //       this.$modal = '#' + this.$modalCon;
    //       console.log('line 4');
    //       // $('.modal-backdrop').addClass('display-none');

    //       $(this.$modal).toggleClass('min');
    //       console.log('line 5');
    //       if ($(this.$modal).hasClass('min')) {
    //         console.log('line 6 inside if');
    //         $('.minmaxCon').append(this.$apnData);
    //         console.log('line 7');
    //         $(this).find('i').toggleClass('fa-minus').toggleClass('fa-clone');
    //         console.log('line 8');
    //       }
    //       else {
    //         console.log('line 9 inside else');
    //         $('.container').append(this.$apnData);
    //         console.log('line 10');
    //         $(this).find('i').toggleClass('fa-clone').toggleClass('fa-minus');
    //         console.log('line 11');
    //       }
    //       console.log('line 12 out');
    //     });
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    const self = this;

    if (this.currentSession) {
      console.info('crrent session exist ', this.currentSession);
      this.elvideoAudioDiv.nativeElement.append(this.currentSession);
    }


    this.rtcAV.onMute(function(e) {
      self.onMuteEvent$.next(e);
    });

    this.rtcAV.onUnMute(function(e) {
      self.onUnMuteEvent$.next(e);
    });

    this.rtcAV.onSpeaking(function (e) {
      self.onSpeakingEvent$.next(e);
    });

    this.rtcAV.onSilence(function (e) {
      self.onSilenceEvent$.next(e);
    });

    this.rtcAV.onVolumeChange(function (e) {
      self.onVolumeChangeEvent$.next(e);
    });

  } 

  addStream(event) {
    if (event.stream.isVideo) {
      if (event.stream.isScreen) {
        console.info('coming inside screen');
        let videoRef: ComponentRef<VideoChatComponent>;

        const factory: ComponentFactory<VideoChatComponent> =
          this.resolver.resolveComponentFactory(VideoChatComponent);
          if (event.type === 'local'){
            videoRef = this.elmyVideoAudioPlacedHere.createComponent(factory);
          } else {
            videoRef = this.elvideoAudioPlacedHere.createComponent(factory);
          }

        videoRef.instance.id = event.userid;
        videoRef.instance.name = event.extra.name;
        videoRef.instance.emial = event.extra.email;
        videoRef.instance.streamId = event.streamid;
        videoRef.instance.rtcStream = event;

        //     if (event.type === 'local') {
//        videoRef.instance.speechEvents = this.initHark({
//          stream: event.stream,
//          streamedObject: event,
//          connection: this.rtcAV.audioVideoConnection,
//        });

        // this.speechEvents.push(videoRef.instance.speechEvents);
//        this.speechEvents[event.streamid] = videoRef.instance.speechEvents;
        //     }

        videoRef.instance.onSilenceEvent$ = this.onSilenceEvent$;
        videoRef.instance.onSpeakingEvent$ = this.onSpeakingEvent$;
        videoRef.instance.onVolumeChangeEvent$ = this.onVolumeChangeEvent$;

        videoRef.instance.onMuteEvent$ = this.onMuteEvent$;
        videoRef.instance.onUnMuteEvent$ = this.onUnMuteEvent$;

        //    videoRef.instance.manipulateEvent(event);

        this.videoComponentsRef.push(videoRef);
        console.log('video screen ComponentRec', this.videoComponentsRef);


      } else {
        console.info('coming insie video');
        let videoRef: ComponentRef<VideoChatComponent>;

        const factory: ComponentFactory<VideoChatComponent> =
          this.resolver.resolveComponentFactory(VideoChatComponent);
          if (event.type === 'local') {
            videoRef = this.elmyVideoAudioPlacedHere.createComponent(factory);
          } else {
            videoRef = this.elvideoAudioPlacedHere.createComponent(factory);
          }

        videoRef.instance.id = event.userid;
        videoRef.instance.name = event.extra.name;
        videoRef.instance.emial = event.extra.email;
        videoRef.instance.streamId = event.streamid;
        videoRef.instance.rtcStream = event;

        //    if (event.type === 'local') {
//        videoRef.instance.speechEvents = this.initHark({
//          stream: event.stream,
//          streamedObject: event,
//          connection: this.rtcAV.audioVideoConnection,
//        });

        // this.speechEvents.push(videoRef.instance.speechEvents);
//        this.speechEvents[event.streamid] = videoRef.instance.speechEvents;
        //     }

        videoRef.instance.onSilenceEvent$ = this.onSilenceEvent$;
        videoRef.instance.onSpeakingEvent$ = this.onSpeakingEvent$;
        videoRef.instance.onVolumeChangeEvent$ = this.onVolumeChangeEvent$;

        videoRef.instance.onMuteEvent$ = this.onMuteEvent$;
        videoRef.instance.onUnMuteEvent$ = this.onUnMuteEvent$;

        //    videoRef.instance.manipulateEvent(event);

        this.videoComponentsRef.push(videoRef);
        console.log('videoComponentRec', this.videoComponentsRef);
      }
    }
    if (event.stream.isAudio) {
      console.info('coming inside audio');
      let audioRef: ComponentRef<AudioChatComponent>;

      const factory: ComponentFactory<AudioChatComponent> =
        this.resolver.resolveComponentFactory(AudioChatComponent);
        if (event.type === 'local'){
          audioRef = this.elmyVideoAudioPlacedHere.createComponent(factory);
        } else {
          audioRef = this.elvideoAudioPlacedHere.createComponent(factory);
        }
      audioRef.instance.id = event.userid;
      audioRef.instance.name = event.extra.name;
      audioRef.instance.emial = event.extra.email;
      audioRef.instance.streamId = event.streamid;
      audioRef.instance.rtcStream = event;

      //  if (event.type === 'local') {
//      audioRef.instance.speechEvents = this.initHark({
//        stream: event.stream,
//        streamedObject: event,
//       connection: this.rtcAV.audioVideoConnection,
//      });

      // this.speechEvents.push(audioRef.instance.speechEvents);
//      this.speechEvents[event.streamid] = audioRef.instance.speechEvents;
      //   }

      audioRef.instance.onSilenceEvent$ = this.onSilenceEvent$;
      audioRef.instance.onSpeakingEvent$ = this.onSpeakingEvent$;
      audioRef.instance.onVolumeChangeEvent$ = this.onVolumeChangeEvent$;

      audioRef.instance.onMuteEvent$ = this.onMuteEvent$;
      audioRef.instance.onUnMuteEvent$ = this.onUnMuteEvent$;

      //    videoRef.instance.manipulateEvent(event);

      this.audioComponentsRef.push(audioRef);
      console.log('audioComponentRec', this.audioComponentsRef, event);
    }

  }

  deleteStream(event) {
    if (this.speechEvents[event.streamid]) {
      this.speechEvents[event.streamid].stop();
      this.speechEvents.splice(event.streamid, 1);
    }
    if (event.stream.isVideo) {
      if (event.stream.isScreen) {
        console.info('going inside screen condi');

        //  if (event.type === 'local') {
        //    this.speechEvents[event.streamid].stop();
        //   this.speechEvents.splice(event.streamid, 1); 
        //  }

        if (this.videoComponentsRef.length !== 0) {

          this.videoComponentsRef.slice(0).forEach(component => {
            if (component.instance.id === event.userid) {
              console.info(component.instance.name, 'leave the room custom message');
              console.info(event.type, 'video is removed');
              component.destroy();

              const index: number = this.videoComponentsRef.indexOf(component);
              if (index !== -1) {
                this.videoComponentsRef.splice(index, 1);
                console.info('component gonna delete', component.instance.id);
                console.info('after deletion component', this.videoComponentsRef);
              }
            }
          });

        }
      } else {
        console.info('going inside video condi');

        // if (event.type === 'local') {
        //   this.speechEvents[event.streamid].stop();
        //   console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2local speech events deleted');
        //   this.speechEvents.splice(event.streamid, 1);
        // }

        if (this.videoComponentsRef.length !== 0) {

          this.videoComponentsRef.slice(0).forEach(component => {
            if (component.instance.id === event.userid) {
              console.info(component.instance.name, 'leave the room custom message');
              console.info(event.type, 'video is removed');
              component.destroy();

              const index: number = this.videoComponentsRef.indexOf(component);
              if (index !== -1) {
                this.videoComponentsRef.splice(index, 1);
                console.info('component gonna delete', component.instance.id);
                console.info('after deletion component', this.videoComponentsRef);
              }
            }
          });

        }
      }

    }
    if (event.stream.isAudio) {
      console.info('going inside audio condi on streamended');

      // if (event.type === 'local') {
      //   this.speechEvents[event.streamid].stop();
      //   this.speechEvents.splice(event.streamid, 1);
      // }

      if (this.audioComponentsRef.length !== 0) {

        this.audioComponentsRef.forEach(component => {
          if (component.instance.id === event.userid) {
            console.info(component.instance.name, 'leave the room custom message');
            console.info(event.type, 'audio is removed');
            component.destroy();

            const index: number = this.audioComponentsRef.indexOf(component);
            if (index !== -1) {
              this.audioComponentsRef.splice(index, 1);
              console.info('component gonna delete', component.instance.id);
              console.info('after deletion component', this.audioComponentsRef);
            }
          }
        });

      }

    }

  }

  // initHark(args) {
  //   // if (!window.hark) {
  //   //     throw 'Please link hark.js';
  //   //     return;
  //   // }
  //   const self = this;
  //   const connection = args.connection;
  //   const streamedObject = args.streamedObject;
  //   const stream = args.stream;

  //   const options = {
  //     // threshold: -5,
  //     interval: 300,
  //   };
  //   const speechEvents = hark(stream, options);

  //   // speechEvents.on('speaking', function () {
  //   // //  console.log('speaking');
  //   //   connection.onspeaking(streamedObject);
  //   // });

  //   // speechEvents.on('stopped_speaking', function () {
  //   //  // console.log('no speaking'); 
  //   //   connection.onsilence(streamedObject);
  //   // });

  //   speechEvents.on('volume_change', function (volume, threshold) {
  //    // console.log('volume, threshold ', streamedObject.userid, volume, threshold);
  //     streamedObject.volume = volume;
  //     streamedObject.threshold = threshold;
  //   //  self.onVolumeChangeEvent$.next({ volume: volume, threshold: threshold });
  //     self.onVolumeChangeEvent$.next(streamedObject);
  //   // connection.onvolumechange(streamedObject);
  //   });

  //   // setTimeout(function() { 
  //   //     speechEvents.stop();
  //   // }, 20000);


  //   /// check this for consistency for events......
  //   return speechEvents;
  // }


  clearAll() {
    console.log('speech Events:', this.speechEvents);
    this.speechEvents.forEach(event => {
      console.info('######################################speech events stoped ', event);
      event.stop();
    });
  }

  closeModal(result) {
    const self = this;
    //  this.clearAll();
    this.rtcAV.removeAttachStreams();

    this.currentSession = null;
    this.emitCurrentSession.next(this.currentSession);
    setTimeout(function () {
      self.activeModal.close(result);
    }, 50);


  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  minimize() {
    this.currentSession = this.elvideoAudioDiv.nativeElement;
    this.emitCurrentSession.next(this.currentSession);
    this.activeModal.close('minimize');
    // console.log('line 1');
    // this.$modalCon = $(this).closest('.mymodal').attr('id');
    // console.log('line 2', this.$modalCon);
    // this.$apnData = $(this).closest('.mymodal');
    // console.log('line 3', this.$apnData);
    // this.$modal = '#' + this.$modalCon;
    // console.log('line 4',this.$modal);
    // // $('.modal-backdrop').addClass('display-none');

    // $(this.$modal).toggleClass('min');
    // console.log('line 5');
    // if ($(this.$modal).hasClass('min')) {
    //   console.log('line 6 inside if');
    //   $('.minmaxCon').append(this.$apnData);
    //   console.log('line 7');
    //   $(this).find('i').toggleClass('fa-minus').toggleClass('fa-clone');
    //   console.log('line 8');
    // }
    // else {
    //   console.log('line 9 inside else');
    //   $('.container').append(this.$apnData);
    //   console.log('line 10');
    //   $(this).find('i').toggleClass('fa-clone').toggleClass('fa-minus');
    //   console.log('line 11');
    // }
    // console.log('line 12 out');
  }

}
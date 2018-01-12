
import {
  Component, OnInit, ViewChild, ViewContainerRef,
  ComponentRef, ComponentFactory, ComponentFactoryResolver,
  AfterViewInit, OnDestroy,
} from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VideoChatComponent } from '../videoComponent';
import { AudioChatComponent } from '../audioComponent';

import { AudioVideoService } from '../../../rtc-AV.service';

// declare let $: any;
@Component({
  selector: 'ngbd-modal-basic',
  templateUrl: './modal.component.html',

  styleUrls: ['./modal.component.scss'],
})
export class AVmodal implements OnInit, AfterViewInit {

  @ViewChild('videoAudioPlacedHere', { read: ViewContainerRef }) elvideoAudioPlacedHere;
//  @ViewChild('mainModal') elmainModal;

  videoComponentsRef: ComponentRef<VideoChatComponent>[] = [];
  audioComponentsRef: ComponentRef<AudioChatComponent>[] = [];


  closeResult: string;
  modalHeader: string;
  modalContent: string = `Lorem ipsum dolor sit amet,
   consectetuer adipiscing`;

   stream: any;
   



  constructor(private activeModal: NgbActiveModal,
    private resolver: ComponentFactoryResolver,
    private rtcAV: AudioVideoService) { $(document).ready(function() {
      console.log('jquery is ready');
    });
  }

  // open(content) {
  //   this.modalService.open(content).result.subscribe((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }


  ngOnInit() {

  }

  ngAfterViewInit() {
    $('.modal-content').draggable({
      handle: '.modal-header',
      opacity: 0.8,
      cursor: 'move',
    });
    $('.modal-content').resizable({
      minWidth: 400,
      minHeight: 300,
    });
  }

  addStream(event) {
    if (event.stream.isVideo) {
      if (event.stream.isScreen) {
        console.info('coming inside screen');
        let videoRef: ComponentRef<VideoChatComponent>;

        const factory: ComponentFactory<VideoChatComponent> =
          this.resolver.resolveComponentFactory(VideoChatComponent);
        videoRef = this.elvideoAudioPlacedHere.createComponent(factory);
        videoRef.instance.id = event.userid;
        videoRef.instance.name = event.extra.name;
        videoRef.instance.emial = event.extra.email;
        videoRef.instance.streamId = event.streamid;
        videoRef.instance.rtcStream = event;
        //    videoRef.instance.manipulateEvent(event);

        this.videoComponentsRef.push(videoRef);
        console.log('video screen ComponentRec', this.videoComponentsRef);


      } else {
        console.info('coming insie video');
        let videoRef: ComponentRef<VideoChatComponent>;

        const factory: ComponentFactory<VideoChatComponent> =
          this.resolver.resolveComponentFactory(VideoChatComponent);
        videoRef = this.elvideoAudioPlacedHere.createComponent(factory);
        videoRef.instance.id = event.userid;
        videoRef.instance.name = event.extra.name;
        videoRef.instance.emial = event.extra.email;
        videoRef.instance.streamId = event.streamid;
        videoRef.instance.rtcStream = event;
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
      audioRef = this.elvideoAudioPlacedHere.createComponent(factory);
      audioRef.instance.id = event.userid;
      audioRef.instance.name = event.extra.name;
      audioRef.instance.emial = event.extra.email;
      audioRef.instance.streamId = event.streamid;
      audioRef.instance.rtcStream = event;
      //    videoRef.instance.manipulateEvent(event);

      this.audioComponentsRef.push(audioRef);
      console.log('audioComponentRec', this.audioComponentsRef);
    }

  }

  deleteStream(event) {
    if (event.stream.isVideo) {
      if (event.stream.isScreen) {
        console.info('going inside screen condi');
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

  closeModal(result) {
    this.activeModal.close(result);
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

}

import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input, ComponentFactoryResolver,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'senderFileComponent',
    template: `<li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time" >{{time}}, Today</span> &nbsp; &nbsp;
      <span class="message-data-name" >{{name}}</span> <i class="fa fa-circle me"></i>
    </div>
    <div class="message my-message float-right">
    <a [href]="sanitize()" target='_blank' download='{{file.name}}'>Download {{file.name}}</a>
    </div>
    </li>`,
    styleUrls: ['./sendReceive-template.scss'],
})
export class SenderFileComponent implements AfterViewInit {
    @Input() time: string;
   // @Input() message: string;
    @Input() name: string;
    @Input() file: any;

    constructor(private sanitizer: DomSanitizer) {

    }


    @ViewChild('fileContainer') elfileContainer;

    //  renderFile(file) {
    //     this.elfileContainer.nativeElement.innerHTML =
    //     '<a href="' + file.url + '" target="_blank" download="' + file.name + '">' + file.name + '</a>';
    // }

    sanitize() {
      return this.sanitizer.bypassSecurityTrustUrl(this.file.url);
    }
    ngAfterViewInit() {

    }
}
import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input, ComponentFactoryResolver,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'receiverFileComponent',
    template: `<li>
    <div class="message-data">
      <span class="message-data-name"><i class="fa fa-circle online"></i> {{name}}</span>
      <span class="message-data-time">{{time}}, Today</span>
    </div>
    <div class="message other-message">
    <a [href]="sanitize()" target='_blank' download='{{file.name}}'>Download {{file.name}}</a>
    </div>
    </li>`,
    styleUrls: ['./sendReceive-template.scss'],
})

export class ReceiverFileComponent {
    @Input() time: string; 
    // @Input() message: string;
    @Input() name: string;
    @Input() file: any;

    constructor(private sanitizer: DomSanitizer) {

    }

    sanitize() {
        return this.sanitizer.bypassSecurityTrustUrl(this.file.url);
      }
}

import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input, ComponentFactoryResolver,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';


@Component({
    selector: 'receiverComponent',
    template: `<li>
    <div class="message-data">
      <span class="message-data-name"><i class="fa fa-circle online"></i> {{name}}</span>
      <span class="message-data-time">{{time}}, Today</span>
    </div>
    <div class="message other-message">
      {{message}}
    </div>
    </li>`,
    styleUrls: ['./sendReceive-template.scss'],
})

export class ReceiverComponent {
    @Input() time: string;
    @Input() message: string;
    @Input() name: string;
}
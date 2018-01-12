
import {
    Component, OnInit, AfterViewInit, ViewChild,
    ElementRef, Input, ComponentFactoryResolver,
    ComponentFactory, ComponentRef, ViewContainerRef,
    OnDestroy, Output, EventEmitter,
} from '@angular/core';


@Component({
    selector: 'senderComponent',
    template: `<li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time" >{{time}}, Today</span> &nbsp; &nbsp;
      <span class="message-data-name" >{{name}}</span> <i class="fa fa-circle me"></i>
    </div>
    <div class="message my-message float-right">
      {{message}}
    </div>
    </li>`,
    styleUrls: ['./sendReceive-template.scss'],
})
export class SenderComponent {
    @Input() time: string;
    @Input() message: string;
    @Input() name: string;
}
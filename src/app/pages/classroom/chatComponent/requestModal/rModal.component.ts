import { Component, Input, OnInit, AfterViewInit, ViewChild,
        ElementRef } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-request',
    templateUrl: './rModal.component.html',
    styleUrls: ['./rModal.component.scss'],
})
export class RequestModal implements OnInit, AfterViewInit {

    @Input() id: string;
    @Input() img: string;
    @Input() name: string;
    @Input() emial: string;

    @ViewChild('bodyDiv') elbodyDiv: ElementRef;


    requestType: string;
    requestBody: string;
    constructor(private activeModal: NgbActiveModal) { }

    closeModal(result) {
        this.activeModal.close(result);
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

        this.elbodyDiv.nativeElement.style.backgroundImage = this.img;
        console.log(this.elbodyDiv, this.img);
    }

}
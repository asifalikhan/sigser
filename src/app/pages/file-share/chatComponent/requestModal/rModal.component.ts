import { Component } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-request',
    templateUrl: './rModal.component.html',
    styleUrls: ['./rModal.component.scss'],
})
export class RequestModal {
    requestType: string;
    requestBody: string;
    constructor(private activeModal: NgbActiveModal) { }

    closeModal(result) {
        this.activeModal.close(result);
    }

}

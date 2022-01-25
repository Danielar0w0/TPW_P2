import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'InfoModal',
    templateUrl: './info-modal.component.html',
    styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit {

    @Input() title!: string;
    @Input() body!: string;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    closeModal(): void {
        this.modal.close();
    }

}

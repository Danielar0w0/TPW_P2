import {Component, Input, OnInit} from '@angular/core';
import {User} from "../utils/user";

@Component({
    selector: 'MessagesUserPanel',
    templateUrl: './messages-user-panel.component.html',
    styleUrls: ['./messages-user-panel.component.css']
})
export class MessagesUserPanelComponent implements OnInit {

    @Input() messagingFriend!: User;

    constructor() {
    }

    ngOnInit(): void {
    }

}

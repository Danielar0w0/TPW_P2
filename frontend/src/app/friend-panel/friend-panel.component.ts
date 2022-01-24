import {Component, Input, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {UsersService} from "../services/users/users.service";

@Component({
    selector: 'FriendPanel',
    templateUrl: './friend-panel.component.html',
    styleUrls: ['./friend-panel.component.css']
})
export class FriendPanelComponent implements OnInit {

    @Input() friend!: User;

    constructor(private usersService: UsersService) {
    }

    ngOnInit(): void {
    }

}

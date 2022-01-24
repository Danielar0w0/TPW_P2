import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {Session} from "../utils/session";
import {MessagesService} from "../services/messages/messages.service";
import {UsersService} from "../services/users/users.service";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    session: Session | null;
    users: User[];

    constructor(private messagesService: MessagesService, private usersService: UsersService) {
        this.session = Session.getCurrentSession();
        this.users = []
    }

    ngOnInit(): void {

        if (this.session === undefined || this.session === null) return;

        this.usersService.getUserMessages(this.session.email)
            .subscribe({
                error: err => console.error("Error getting all user messages: " + err.toString()),
                next: messages => {
                    messages.forEach(message => {

                        this.usersService.getUser(message.receiver)
                            .subscribe({
                                error: err => console.error("Error getting user by receiver email: " + err.toString()),
                                next: user => this.users.push(user)
                            });

                    });
                }
            });

    }

}

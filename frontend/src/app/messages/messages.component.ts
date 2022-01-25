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
    friends: User[];

    constructor(private messagesService: MessagesService, private usersService: UsersService) {
        this.session = Session.getCurrentSession();
        this.users = []
        this.friends = [];
    }

    ngOnInit(): void {

        if (this.session === undefined || this.session === null) return;

        this.usersService.getUserMessages(this.session.email)
            .subscribe({
                error: err => console.error("Error getting all user messages: " + err.toString()),
                next: messages => {
                    messages.forEach(message => {

                        if (this.session?.email === message.sender) {

                            this.usersService.getUser(message.receiver)
                                .subscribe({
                                    error: err => console.error("Error getting user by receiver email: " + err.toString()),
                                    next: user => {
                                        if (this.users.filter(userFiltered => userFiltered.user_email === user.user_email).length <= 0)
                                            this.users.push(user)
                                    }
                                });

                        } else {
                            this.usersService.getUser(message.sender)
                                .subscribe({
                                    error: err => console.error("Error getting user by receiver email: " + err.toString()),
                                    next: user => {
                                        if (this.users.filter(userFiltered => userFiltered.user_email === user.user_email).length <= 0)
                                            this.users.push(user)
                                    }
                                });
                        }

                    });
                }
            });


        this.usersService.getUserFriendships(this.session.email)
            .subscribe({
                error: err => {
                    console.log("Error obtaining user's friends: " + err);
                },
                next: friendships => {

                    friendships.forEach(friendship => {

                        this.usersService.getUser(friendship.second_user)
                            .subscribe({
                                error: err => {
                                    console.log("Error obtaining user by friendship: " + err);
                                },
                                next: user => {
                                    this.friends.push(user);
                                }
                            })
                    });

                }

            });
    }

}

import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {UsersService} from "../services/users/users.service";
import {Session} from "../utils/session";

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    session!: Session | null;
    friends!: User[];

    constructor(private usersService: UsersService) {
        this.session = Session.getCurrentSession();
        this.friends = [];
    }

    ngOnInit(): void {

        if (this.session === null) return;

        this.usersService.getUserFriendships(this.session.email)
            .subscribe({
                error: err => {
                    console.log("Error obtaining user's friends: " + err);
                },
                next: friendships => {

                    friendships.forEach(friendship => {

                        if (friendship.first_user === this.session?.email) {

                            this.usersService.getUser(friendship.second_user)
                                .subscribe({
                                    error: err => {
                                        console.log("Error obtaining user by friendship: " + err);
                                    },
                                    next: user => {
                                        this.friends.push(user);
                                    }
                                });

                        } else {

                            this.usersService.getUser(friendship.first_user)
                                .subscribe({
                                    error: err => {
                                        console.log("Error obtaining user by friendship: " + err);
                                    },
                                    next: user => {
                                        this.friends.push(user);
                                    }
                                });

                        }

                    });

                }

            });

    }

    refreshData() {
        this.friends = [];
        this.ngOnInit();
    }
}

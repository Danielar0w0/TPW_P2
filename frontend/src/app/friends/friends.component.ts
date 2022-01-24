import {Component, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {UsersService} from "../services/users/users.service";

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    user!: User;
    friends!: User[];

    constructor(private usersService: UsersService) {
        this.user = new User("hugogoncalves13@ua.pt", "hugo", "hugo", "", false);
        this.friends = [];
    }

    ngOnInit(): void {

        this.usersService.getUserFriendships(this.user.email)
            .subscribe({
                error: err => {
                    console.log("Error obtaining user's friends: " + err);
                },
                next: friendships => {

                    friendships.forEach(friendship => {

                        this.usersService.getUser(friendship.second_user)
                            .subscribe({
                                error: err => {
                                    console.log("Error obtaining user by friendship.");
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

import {Component, Input, OnInit} from '@angular/core';
import {User} from "../utils/user";
import {UsersService} from "../services/users/users.service";
import {Session} from "../utils/session";
import {FriendshipsService} from "../services/friendships/friendships.service";

@Component({
    selector: 'FriendPanel',
    templateUrl: './friend-panel.component.html',
    styleUrls: ['./friend-panel.component.css']
})
export class FriendPanelComponent implements OnInit {

    @Input() friend!: User;
    session!: Session | null;

    constructor(private usersService: UsersService, private friendshipsService: FriendshipsService) {
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {
    }

    unfollowUser(): void {

        if (this.session === null || this.friend.user_email === undefined) {
            console.log("Debug");
            return;
        }

        let currentUserEmail = this.session.email;

        this.friendshipsService.deleteFriendship(currentUserEmail, this.friend.user_email)
            .subscribe({
                error: err => {
                    console.log('Error unfollowing user: ' + err);
                },
                complete: () => {
                    alert("User unfollowed");
                }
            })

    }

}

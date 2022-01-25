import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../utils/user";
import {UsersService} from "../services/users/users.service";
import {Session} from "../utils/session";
import {FriendshipsService} from "../services/friendships/friendships.service";
import {CommentModalComponent} from "../comment-modal/comment-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../info-modal/info-modal.component";

@Component({
    selector: 'FriendPanel',
    templateUrl: './friend-panel.component.html',
    styleUrls: ['./friend-panel.component.css']
})
export class FriendPanelComponent implements OnInit {

    @Input() friend!: User;
    @Output() dataChanged = new EventEmitter<void>();
    session!: Session | null;

    constructor(private usersService: UsersService, private friendshipsService: FriendshipsService, private modalService: NgbModal) {
        this.session = Session.getCurrentSession();
    }

    ngOnInit(): void {
    }

    unfollowUser(): void {

        if (this.session === null || this.friend.user_email === undefined) return;

        let currentUserEmail = this.session.email;

        this.friendshipsService.deleteFriendship(currentUserEmail, this.friend.user_email)
            .subscribe({
                error: err => {
                    console.log('Error unfollowing user: ' + err);
                },
                complete: () => {
                    const modalRef = this.modalService.open(InfoModalComponent);
                    modalRef.componentInstance.title = 'User Unfollowed';
                    modalRef.componentInstance.body = "You've successfully unfollowed " + this.friend.username + ".";
                    this.dataChanged.emit();
                }
            })

    }

}

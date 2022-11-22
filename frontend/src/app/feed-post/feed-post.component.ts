import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../utils/post";
import {CommentModalComponent} from "../comment-modal/comment-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../utils/user";
import {Session} from "../utils/session";
import {UsersService} from "../services/users/users.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'FeedPost',
    templateUrl: './feed-post.component.html',
    styleUrls: ['./feed-post.component.css']
})
export class FeedPostComponent implements OnInit {

    @Input() post?: Post;
    postOwner!: User;

    constructor(private modal: NgbModal, private usersService: UsersService) {
    }

    ngOnInit(): void {

        if (!this.post) return;

        this.usersService.getUser(this.post.user)
            .subscribe({
                error: err => console.error("Error getting user: " + err.toString()),
                next: user => this.postOwner = user,
                complete: () => {
                    if (this.postOwner.image)
                        this.postOwner.image = environment.apiURL + this.postOwner.image.replace("/BubbleAPI", "");

                }
            });

    }

    openModal() {
        const modalRef = this.modal.open(CommentModalComponent);
        modalRef.componentInstance.post = this.post;
        modalRef.componentInstance.user_profile = Session.getCurrentSession();
    }

}

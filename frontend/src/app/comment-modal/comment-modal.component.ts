import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../utils/post";
import {User} from "../utils/user";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CommentsService} from "../services/comments/comments.service";

@Component({
    selector: 'app-comment-modal',
    templateUrl: './comment-modal.component.html',
    styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {

    @Input() post!: Post;
    @Input() user_profile!: User;

    comment_content?: string;
    submitted?: boolean;
    statusMessage?: string;

    constructor(private commentsService: CommentsService, private modal: NgbActiveModal) {
        this.submitted = false;
    }

    ngOnInit(): void {

    }

    closeModal() {
        this.modal.close();
    }

    submitComment() {
        if (this.comment_content !== undefined) {
            this.commentsService.createComment(this.post.post_id, this.user_profile.email, this.comment_content)
                .subscribe({
                    error: err => {
                        this.statusMessage = 'Error submitting the comment.';
                    },
                    complete: () => {
                        this.statusMessage = 'Successfully submitted the comment.';
                    }
                }).add(() => this.submitted = true);
        }
    }

}

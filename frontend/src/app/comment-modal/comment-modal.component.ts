import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../utils/post";
import {User} from "../utils/user";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CommentsService} from "../services/comments/comments.service";
import {Session} from "../utils/session";

@Component({
    selector: 'app-comment-modal',
    templateUrl: './comment-modal.component.html',
    styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {

    @Input() post!: Post;
    session: Session | null;

    comment_content?: string;
    submitted?: boolean;
    statusMessage?: string;

    constructor(private commentsService: CommentsService, private modal: NgbActiveModal) {
        this.session = Session.getCurrentSession();
        this.submitted = false;
    }

    ngOnInit(): void {

    }

    closeModal() {
        this.modal.close();
    }

    submitComment() {
        if (this.comment_content !== undefined && this.session !== null) {
            this.commentsService.createComment(this.post.post_id, this.session.email, this.comment_content)
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
